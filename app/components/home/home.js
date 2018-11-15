import React from 'react';

import {
  MdLocationOn,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdBlurCircular,
  MdGroupWork,
  MdExplore
} from 'react-icons/md';

import Instance from '../instance/instance';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      instances: [],
      filters: [
        {
          verbose: "Locatie",
          icon: 'MdLocationOn',
          items: [
            { verbose: "Aalsmeer", matchValue: "aalsmeer", active: true },
            { verbose: "Naaldwijk", matchValue: "naaldwijk", active: true },
            { verbose: "Rijnswijk", matchValue: "rijnswijk", active: true },
            { verbose: "Other", matchValue: "other", active: true }
          ]
        },
        {
          verbose: "Regio",
          icon: 'MdGroupWork',
          items: [
            { verbose: "Eu-west-1a", matchValue: "eu-west-1a", active: true },
            { verbose: "Eu-west-1b", matchValue: "eu-west-1b", active: true },
          ]
        },
        {
          verbose: "Omgeving",
          icon: 'MdBlurCircular',
          items: [
            { verbose: "Ontwikkeling (O)", matchValue: 1, active: true, colorCode: "purple" },
            { verbose: "Test (T)", matchValue: 2, active: true, colorCode: "green" },
            { verbose: "Acceptatie (A)", matchValue: 3, active: true, colorCode: "orange" },
            { verbose: "Productie (P)", matchValue: 4, active: true, colorCode: "red" }
          ]
        },
        {
          verbose: "Status",
          icon: 'MdExplore',
          items: [
            { verbose: "Starting up", matchValue: 1, active: true },
            { verbose: "Running", matchValue: 2, active: true },
            { verbose: "Shutting down", matchValue: 3, active: true },
            { verbose: "Stopped", matchValue: 4, active: true }
          ]
        },
      ]
    };
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
      },
      {
        metadata: {
          name: 'rfh-jda-sql-prd-openstaging.rfh.protected',
          verbose: 'por-ex-ah-003',
          instanceId: 'i-7235cs2356ae3456'
        },
        location: {
          location: 'rijnswijk',
          availabilityZone: 'eu-west-1b',
          environment: 3,
        },
        instance: {
          type: 't3.large',
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
      },
      {
        metadata: {
          name: 'rfh-jda-sql-prd-openstaging.rfh.public',
          verbose: 'vtl-pl-bt-001',
          instanceId: 'i-47535dsf647345kasdf'
        },
        location: {
          location: 'aalsmeer',
          availabilityZone: 'eu-west-1b',
          environment: 1,
        },
        instance: {
          type: 't3.large',
          startuptime: new Date(),
          state: 1
        },
        status: {
          health: {
            amount: 2,
            passed: 1
          },
          alarm: 1
        }
      }
    ];

    this.setState({
      instances: instances
    });
  }

  updateFilters() {
    this.setState({
      filters: this.state.filters
    });
  }

  render() {
    var instances = this.state.instances.filter((instance) => {
      var matchLocation = false;
      var matchRegion = false;
      var matchEnvironment = false;
      var matchStatus = false;

      this.state.filters.map((filterGroup) => {
        filterGroup.items.filter((filter) => {
          return filter.active; // We only need the active filters
        })
        .map((filter) => {
          // location filter
          if(filterGroup.verbose.toLowerCase() == 'locatie') {
            if(instance.location.location.toLowerCase() == filter.matchValue.toLowerCase()) {
              matchLocation = true;
            }
          }
          // region filter
          if(filterGroup.verbose.toLowerCase() == 'regio') {
            if(instance.location.availabilityZone.toLowerCase() == filter.matchValue.toLowerCase()) {
              matchRegion = true;
            }
          }
          // Environment filter
          if(filterGroup.verbose.toLowerCase() == 'omgeving') {
            if(instance.location.environment == filter.matchValue) {
              matchEnvironment = true;
            }
          }
          // Status filter
          if(filterGroup.verbose.toLowerCase() == 'status') {
            if(instance.instance.state == filter.matchValue) {
              matchStatus = true;
            }
          }
        });
      });

      if(matchLocation || matchRegion || matchEnvironment || matchStatus) {
        return instance;
      }

    }).map((instance) => {
      return <div className="col-xs-3">
        <Instance instance={instance} key={instance.metadata.instanceId}></Instance>
      </div>;
    });

    var filters = this.state.filters.map((filterGroup) => {
      return <section>
        <h2>
          { filterGroup.icon == 'MdLocationOn' ? <MdLocationOn/> : null }
          { filterGroup.icon == 'MdGroupWork' ? <MdGroupWork/> : null }
          { filterGroup.icon == 'MdBlurCircular' ? <MdBlurCircular/> : null }
          { filterGroup.icon == 'MdExplore' ? <MdExplore/> : null }
          { filterGroup.verbose }
        </h2>
        <ul>
          {
            filterGroup.items.map((filter) => {
              return <li onClick={() => { filter.active = !filter.active; this.updateFilters(); } }>
                { filter.active ? <MdCheckBox /> : <MdCheckBoxOutlineBlank /> }
                { filter.colorCode != undefined ? <span className={`filter__color filter__color--${filter.colorCode}`}></span> : null }
                <div>
                  { filter.verbose }
                </div>
              </li>
            })
          }
        </ul>
      </section>
    });

    return (
      <div className="homePage row">
        <section className="col-xs-9 scrollable">
          <section className="row">
            <div className="col-xs-12">
              <input className="search" placeholder="zoeken"></input>
              <h1>Instances ({instances.length})</h1>
            </div>
          </section>
          <section className="row scroll-overflow">
            { instances }
          </section>
        </section>
        <aside className="sidebar col-xs-3">
          <h1>Filters</h1>
          { filters }
        </aside>
      </div>
    );
  }
}
