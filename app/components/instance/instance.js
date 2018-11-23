import React from 'react';

import axios from 'axios';

import {
  EC2_API_GATEWAY,
  DYNAMODB_API_GATEWAY
} from '../../lib/constants/endpoints';

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
      instance: props.instance
    }
  }

  componentDidMount() {
    this.getInstanceAlias();

    this.poll(); // poll one time to get some data

    const pollTimer = setInterval(() => {
      this.poll();
    }, 5 * 60 * 1000);

    this.setState({polltimer: pollTimer})
  }

  componentWillUnmount(){
    clearInterval(this.state.pollTimer);
  }

  poll() {
    // If instance is not running(16), there's no need to perform health-checks
    if (this.state.instance.instance.state != 16) {
      this.state.instance.status.health.state = 0;
      this.updateInstance();
      return;
    }

    //Updating of Health Checks of instance
    axios.get(EC2_API_GATEWAY + 'pollstatus', {
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
	const Alias_gateway_url = "https://9ptub4glw2.execute-api.eu-west-1.amazonaws.com/Testing/";
	var instanceId = this.state.instance.metadata.instanceId;
		
	axios.get(Alias_gateway_url,
	  {
		  headers: { 'Content-Type': 'application/json' },
		  params: { InstanceId: instanceId }
	  })
	.then((response) => {
		if (typeof response.data.Item != 'undefined')
		{
			this.state.instance.metadata.verbose = response.data.Item.InstanceAlias.S;
			this.updateInstance();
		}
	})
	.catch((error) => {
	  console.log('Alias get error: ', error);
	});
  }

  toggleInstanceState() {
    var state = this.state.instance.instance.state;

    // You can only toggle the state when it's either running (16) or stopped (80)
    if(state != 16 && state != 80) return;

    this.state.instance.instance.state = state == 16 ? 64 : 0;
    this.updateInstance();

    axios.get(EC2_API_GATEWAY + (state == 16 ? 'stop' : 'start'), {
      params: {
        ID: this.state.instance.metadata.instanceId
      }
    })
    .then((response) => {
    })
    .catch((error) => {
      console.log('error', error);
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

    return (
      <div className={ `c-instance ${environment}` }>
        <header>
          <h1>{this.state.instance.metadata.verbose}</h1>
          <span>{this.state.instance.metadata.name}</span>
        </header>

        <ul className="row">
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
            { this.state.instance.instance.state == 16 ? runTime.hours+'h '+runTime.minutes+'m' : '-'}
          </li>
        </ul>

        <button disabled={buttonDisabled} onClick={() => this.toggleInstanceState() }>
          {buttonIcon} {buttonVerbose}
        </button>
      </div>
    )
  }
}
