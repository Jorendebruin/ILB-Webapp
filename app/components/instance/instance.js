import React from 'react';

import {
  MdLocationOn,
  MdWatchLater,
  MdCloud,
  MdHealing,
  MdExplore,
  MdPlayArrow
} from 'react-icons/md';

export default class Home extends React.Component  {
  constructor(props) {
    super();
    this.state = {
      instance: props.instance
    }
  }

  render() {
    var instanceState;
    switch (this.state.instance.instance.state) {
      case 2:
        instanceState = 'state--ok';
        break;
      case 4:
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

    return (
      <div className={ `c-instance ${environment}` }>
        <header>
          <h1>{this.state.instance.metadata.verbose}</h1>
          <span>{this.state.instance.metadata.name}</span>
        </header>

        <ul>
          <li>
            <MdLocationOn />
            {this.state.instance.location.location}
          </li>
          <li>
            <MdCloud />
            {this.state.instance.location.availabilityZone}
          </li>
          <li className={instanceState}>
            <MdExplore />
            {this.state.instance.instance.state == 1 ? 'starting up' : null}
            {this.state.instance.instance.state == 2 ? 'running' : null}
            {this.state.instance.instance.state == 3 ? 'shutting down' : null}
            {this.state.instance.instance.state == 4 ? 'stopped' : null}
          </li>
          <li className={this.state.instance.status.health.passed < this.state.instance.status.health.amount ? 'state--warning' : 'state--ok'}>
            <MdHealing />
            {this.state.instance.status.health.passed}/{this.state.instance.status.health.amount}
            &nbsp; checks
          </li>
          <li>
            <MdWatchLater />
            02h 32m
          </li>
        </ul>

        <button>
          <MdPlayArrow />
          Start instance
        </button>
      </div>
    )
  }
}
