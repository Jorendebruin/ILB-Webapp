import React from 'react';
import InstanceOverview from './instanceOverview';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import axios from 'axios';

import AwsWebsocket from '../../lib/websocket/Awswebsocket';

import AWS from 'aws-sdk';

import {
  uuid
} from '../../lib/functions/uuid';

import {
  API_GATEWAY_EC2,
  API_GATEWAY_DYNAMODB,
  IOT_HOST
} from '../../lib/constants/endpoints';

import {
  DYNAMO_INSTANCE_LOGS
} from '../../lib/constants/dynamoDbTableNames';

import {
  MdPlace,
  MdWatchLater,
  MdSync,
  MdHealing,
  MdExplore,
  MdPlayArrow,
  MdPause,
  MdStop,
  MdGroupWork,
  MdNotifications
} from 'react-icons/md';

export default class Instance extends React.Component  {
  constructor(props) {
    super();
    this.state = {
      instance: props.instance,
      modalIsOpen: false,
      websocketConnecting: 0 // 0: inactive, 1: starting, 2: connected, 3: error
    }
  }

  componentDidMount() {
    this.getInstanceAlias();

    this.poll(); // poll one time to get some data

    const pollTimer = setInterval(() => {
      this.poll();
    }, 5 * 60 * 1000);

    this.setState({polltimer: pollTimer});

    this.connectToWebSocket();
    Modal.setAppElement('body');
  }

  componentWillUnmount() {
    clearInterval(this.state.pollTimer);
  }

  connectToWebSocket() {
    AWS.config.credentials.get(() => {

      const websocketUrl = new AwsWebsocket().getSignedUrl(IOT_HOST, AWS.config.region, AWS.config.credentials);

      const client = new Paho.MQTT.Client(websocketUrl, uuid());
      const connectOptions = {
        useSSL: true,
        timeout: 3,
        mqttVersion: 4,
        reconnect: true,
        onSuccess: () => {
          this.setState({websocketConnecting: 2});
          client.subscribe('ilb/webapp/instance/'+this.state.instance.metadata.instanceId);
          client.subscribe('ilb/webapp/usermessage');
        },
        onFailure: (err) => {
          this.setState({websocketConnecting: 3});
          console.log(`connect failed: ${err.errorMessage}`);
        }
      };

      // Connecting to client
      this.setState({websocketConnecting: 1});
      client.connect(connectOptions);

      client.onConnectionLost = (err) => {
        this.setState({websocketConnecting: 3});
        console.log(`connect lost: ${err.errorMessage}`);
      };

      client.onMessageArrived = (message) => {
        switch (message.topic) {
          case 'ilb/webapp/usermessage':
            this.userActionEvent(JSON.parse(message.payloadString));
            break;
          default:
            this.cloudWatchActionEvent(JSON.parse(message.payloadString));
            break;
        }
      };
    });
  }

  userActionEvent(message) {
    // Do something here on user actions
  }

  cloudWatchActionEvent(payload) {
    switch (payload.type) {
      case 'stateChange':
        this.state.instance.instance.state = payload.message.state;
        break;
      case 'nameChange':
        this.state.instance.metadata.name = payload.message.name;
        break;
    }

    this.updateInstance();
  }

  poll() {
    // If instance is not running(16), there's no need to perform health-checks
    if (this.state.instance.instance.state != 16) {
      this.state.instance.status.health.state = 0;
      this.updateInstance();
      return;
    }

    //Updating of Health Checks of instance
    axios.get(API_GATEWAY_EC2 + 'pollstatus', {
      headers: { 'Content-Type': 'application/json' },
      params: {
        ID: this.state.instance.metadata.instanceId
      }
    }).then(res => {
      if(res.data.s == 'initializing') {
        this.state.instance.status.health.state = 1
        this.updateInstance();
        return;
      }

      this.state.instance.status.health.state = 2;
      this.state.instance.status.health.passed = !res.data.errorMessage ? res.data.h : 0;

      this.updateInstance();
    });
  }

  updateInstance() {
    this.setState({ instance: this.state.instance });
  }

  getInstanceAlias() {
  	axios.get(API_GATEWAY_DYNAMODB, {
  	  headers: { 'Content-Type': 'application/json' },
  	  params: {
        InstanceId: this.state.instance.metadata.instanceId
      }
    })
  	.then((response) => {
      if(!response.data.Item) return;

			this.state.instance.metadata.verbose = response.data.Item.InstanceAlias.S;
			this.updateInstance();
  	})
  	.catch((error) => {
  	  console.log('Alias get error: ', error);
  	});
  }

  toggleInstanceState() {
    var state = this.state.instance.instance.state;

    // You can only toggle the state when it's either running (16) or stopped (80)
    if (state != 16 && state != 80) return;

    this.state.instance.instance.state = state == 16 ? 64 : 0;
    this.updateInstance();

    axios.get(API_GATEWAY_EC2 + (state == 16 ? 'stop' : 'start'), {
      params: {
        ID: this.state.instance.metadata.instanceId
      }
    })
    .then((response) => {
      this.logAction(state == 16 ? 'stop' : 'start');
    })
    .catch((error) => {
      console.log('error', error);
    });

    console.log(String(this.state.instance.metadata.instanceId));
    console.log("getInstanceOverview End...");

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showOverview !== this.props.showOverview) {
      this.state.showOverview ?
        ReactDOM.render(<InstanceOverview instance={this.state.instance} closeOverview={this.toggleInstanceOverview.bind(this)} />, document.getElementById('main'))
        : null
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  logAction(action) {
    const dynamoDB = new AWS.DynamoDB();

    var params = {
      TableName: DYNAMO_INSTANCE_LOGS,
      Item: {
        'uuid': { S: uuid() },
        'timestamp': { S: new Date().toString() },
        'instance': { S: this.state.instance.metadata.instanceId },
        'user': { S: 'Test user' },
        'action': { S: action }
      }
    };

    dynamoDB.putItem(params, (error, data) => {
      if(error) console.log(`DynamoDB error: ${error}`);
    });
  }

  render() {
    var instanceState;
    var buttonDisabled = true;
    switch (this.state.instance.instance.state) {
      case 16:
        instanceState = 'state--ok';
        buttonDisabled = false;
        break;
      case 80:
        instanceState = 'state--error';
        buttonDisabled = false;
        break;
      default:
        instanceState = 'state--warning';
        break;
    }

    var environment;
    switch (this.state.instance.location.environment) {
      case 1:
        environment = 'environment--o';
        break;
      case 2:
        environment = 'environment--t';
        break;
      case 3:
        environment = 'environment--a';
        break;
      case 4:
        environment = 'environment--p';
        break;
    }

    var timeDiff = new Date(new Date() - new Date(this.state.instance.instance.startuptime));
    var runTime = {
      hours: timeDiff.getHours(),
      minutes: timeDiff.getMinutes()
      };

    var buttonIcon = <MdSync className="loading" />;
    var buttonVerbose = 'Wating for response';
    var instanceStateVerbose;
    switch(this.state.instance.instance.state) {
      case 0:
        instanceStateVerbose = 'pending';
        break;
      case 16:
        buttonIcon = <MdPause />;
        buttonVerbose = 'Stop instance';
        instanceStateVerbose = 'running';
        break;
      case 32:
        instanceStateVerbose = 'shutting-down';
        break;
      case 48:
        buttonIcon = <MdStop />;
        buttonVerbose = "Instance is terminated";
        instanceStateVerbose = 'terminated';
        break;
      case 64:
        instanceStateVerbose = 'stopping';
        break;
      case 80:
        buttonIcon = <MdPlayArrow />;
        buttonVerbose = 'Start instance';
        instanceStateVerbose = 'stopped';
        break;
    }

    var { healthState, healthChecks } = this.getHealthStateAndChecks();

    return (
      <div className={ `c-instance ${environment}` }>
        <span className={`o-websocket o-websocket--connection-state--${this.state.websocketConnecting}`}></span>
        <header onClick={() => this.openModal()}>
          <h1>{this.state.instance.metadata.verbose}</h1>
          <span>{this.state.instance.metadata.name}</span>
        </header>

        <ul className="row" onClick={() => this.toggleInstanceOverview()}>
          <li className="col-xs-6">
            <MdPlace />
            {this.state.instance.location.branch}
          </li>
          <li className="col-xs-6">
            <MdGroupWork />
            {this.state.instance.location.availabilityZone}
          </li>
          <li className={`col-xs-6 state--${healthState}`}>
            <MdHealing />
            { healthChecks }
          </li>
          <li className="col-xs-6">
            <MdNotifications />
            [alarm status]
          </li>
          <li className={`col-xs-6 ${instanceState}`}>
            <MdExplore />
            {instanceStateVerbose}
          </li>
          <li className={`col-xs-6 ${this.state.instance.instance.state != 16 ? 'state--inactive': ''}`}>
            <MdWatchLater />
            {this.state.instance.instance.state == 16 ? runTime.hours + 'h ' + runTime.minutes + 'm' : '-'}
          </li>
        </ul>

        <button disabled={buttonDisabled} onClick={() => this.toggleInstanceState() }>
          {buttonIcon} {buttonVerbose}
        </button>

        <Modal isOpen={this.state.modalIsOpen} contentLabel="Example Modal">
          <InstanceOverview currentInstance={this.state.instance} closeModal={() => this.closeModal() } />
        </Modal>

      </div>

    )
  }


    getHealthStateAndChecks() {
        var healthChecks;
        var healthState;
        switch (this.state.instance.status.health.state) {
            case 0:
                healthChecks = '-';
                healthState = 'inactive';
                break;
            case 1:
                healthChecks = 'Initializing';
                healthState = 'warning';
                break;
            case 2:
                healthChecks = `${this.state.instance.status.health.passed}/${this.state.instance.status.health.amount}`;
                healthState = this.state.instance.status.health.passed < this.state.instance.status.health.amount ? 'error' : 'ok';
                break;
        }
        return { healthState, healthChecks };
    }
}
