import React from 'react';

import { MdLocationOn } from 'react-icons/md';

import Instance from '../instance/instance';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      instances: []
    }
  }

  componentDidMount() {
    var instances = [
      {
        metadata: {
          name: 'rfh-jda-sql-prd-openstaging.rfh.private',
          verbose: 'alx-oo-bt-001',
          instanceId: 'i-7235cs2356as3456'
        },
        location: {
          location: 'naaldwijk',
          availabilityZone: 'eu-west-1a',
          environment: 2,
        },
        instance: {
          type: 't3.medium',
          startuptime: new Date(),
          state: 4
        },
        status: {
          health: {
            amount: 2,
            passed: 2
          },
          alarm: 1
        }
      }
    ];
    this.setState({
      instances: instances
    });
  }

  render() {
    var instances = this.state.instances.map((instance) => {
      return <div className="col-xs-3">
        <Instance instance={instance}></Instance>
      </div>;
    });

    return (
      <div className="homePage row">
        <section className="col-xs-9 scrollable">
          <section className="row">
            <div className="col-xs-12">
              <input className="search" placeholder="zoeken"></input>
              <h1>Instances (20)</h1>
            </div>
          </section>
          <section className="row scroll-overflow">
            { instances }
          </section>
        </section>
        <aside className="sidebar col-xs-3">
          <h1>Filters</h1>
          <section>
            <h2>
              <MdLocationOn />
              Locatie
            </h2>
            <ul>
              <li>Aalsmeer</li>
              <li>Naaldwijk</li>
              <li>Rijnswijk</li>
              <li>Overig</li>
            </ul>
          </section>
        </aside>
      </div>
    );
  }
}
