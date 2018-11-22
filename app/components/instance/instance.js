import React from 'react';

import axios from 'axios';

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

export default class Home extends React.Component  {
  constructor(props) {
    super();
    this.state = {
      instance: props.instance
    }
  }

  componentDidMount() {
    this.poll();
   var pollTimer = setInterval(() => {
      this.poll();
    }, 20000);
    this.setState({polltimer: pollTimer})
  }

  componentWillUnmount(){
    clearInterval(this.state.pollTimer);
  }

  poll() {
    var gateway_url = "https://gq4yjqab1g.execute-api.eu-west-1.amazonaws.com/TEST/";
    var id = this.state.instance.metadata.instanceId;
    
    //Updating time and state of instance
    axios.get(gateway_url + 'describe/?ID=' + id, {
      headers: { 'Content-Type': 'application/json' }
    }).then(result =>
      {
        this.state.instance.instance.state = result.data.instance.state;
        this.state.instance.instance.startuptime = result.data.instance.startuptime;
        this.updateInstance();
      });
    
    // If instance is not running(16), there's no need to perform health-checks
    if (this.state.instance.instance.state != 16) return;

    //Updating of Health Checks of instance
    axios.get(gateway_url + 'pollstatus/?ID=' + id, {
      headers: { 'Content-Type': 'application/json' }
    }).then(res => 
    {
      console.log(res.data)
      if(!res.data.errorMessage)
      {
      this.state.instance.status.health.passed = res.data.h;
      }
      else 
      { this.state.instance.status.health.passed = 0;
      }
      this.state.instance.status.health.amount = 2;
      this.updateInstance();
    });
  }

  updateInstance() {
    this.setState({
      instance: this.state.instance
    });
  }

  toggleInstanceState() {
    const gateway_url = "https://gq4yjqab1g.execute-api.eu-west-1.amazonaws.com/TEST/";
    var state = this.state.instance.instance.state;

    // You can only toggle the state when it's either running (16) or stopped (80)
    if(state != 16 && state != 80) return;

    this.state.instance.instance.state = state == 16 ? 32 : 0;
    this.updateInstance();

    axios.get(gateway_url + (state == 16 ? 'stop' : 'start'), {
      params: {
        ID: this.state.instance.metadata.instanceId
      }
    })
    .then((response) => {
      console.log('finished', response);
      clearInterval(this.state.pollTimer)
    })
    .catch((err) => {
      console.log('error', err);
    })
  }

  render() {
    var instanceState;
    var buttonDisabled = true;
    switch (this.state.instance.instance.state) {
      case 16:
        buttonDisabled = false;
        instanceState = 'state--ok';
        break;
      case 80:
        buttonDisabled = false;
        instanceState = 'state--error';
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
          <li className={`col-xs-6 ${this.state.instance.status.health.passed < this.state.instance.status.health.amount ? 'state--warning' : 'state--ok'}`}>
            <MdHealing />
            {this.state.instance.status.health.passed}/{this.state.instance.status.health.amount}
            &nbsp;checks
          </li>
          <li className="col-xs-6">
            <MdNotifications />
            [alarm status]
          </li>
          <li className={`col-xs-6 ${instanceState}`}>
            <MdExplore />
            {this.state.instance.instance.state == 0 ? 'pending' : null}
            {this.state.instance.instance.state == 16 ? 'running' : null}
            {this.state.instance.instance.state == 32 ? 'shutting-down' : null}
            {this.state.instance.instance.state == 48 ? 'terminated' : null}
            {this.state.instance.instance.state == 64 ? 'stopping' : null}
            {this.state.instance.instance.state == 80 ? 'stopped' : null}
          </li>
          <li className="col-xs-6">
            <MdWatchLater />
            { this.state.instance.instance.state == 16 ? runTime.hours+'h '+runTime.minutes+'m' : '-'}
          </li>
        </ul>

        <button disabled={buttonDisabled} onClick={() => this.toggleInstanceState() }>
          {this.state.instance.instance.state == 0 ? <MdSync className="loading" /> : null}
          {this.state.instance.instance.state == 16 ? <MdPause /> : null}
          {this.state.instance.instance.state == 32 ? <MdSync className="loading" /> : null}
          {this.state.instance.instance.state == 48 ? <MdStop /> : null}
          {this.state.instance.instance.state == 64 ? <MdSync className="loading" /> : null}
          {this.state.instance.instance.state == 80 ? <MdPlayArrow /> : null}

          {this.state.instance.instance.state == 0 ? 'Wating for response' : null}
          {this.state.instance.instance.state == 16 ? 'Stop instance' : null}
          {this.state.instance.instance.state == 32 ? 'Wating for response' : null}
          {this.state.instance.instance.state == 48 ? 'Instance is terminated' : null}
          {this.state.instance.instance.state == 64 ? 'Wating for response' : null}
          {this.state.instance.instance.state == 80 ? 'Start instance' : null}
        </button>
      </div>
    )
  }
}
