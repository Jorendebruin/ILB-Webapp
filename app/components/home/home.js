import React from 'react';

import {
  MdLocationOn,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdBlurCircular,
  MdGroupWork,
  MdExplore,
  MdSearch
} from 'react-icons/md';

import Instance from '../instance/instance';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      instances: [],
      sortBy: null,
      searchFilter: null,
      filters: [
        {
          verbose: "Locatie",
          icon: 'MdLocationOn',
          items: [
            { verbose: "Aalsmeer", matchValue: "aalsmeer", active: true },
            { verbose: "Naaldwijk", matchValue: "naaldwijk", active: true },
            { verbose: "Rijnswijk", matchValue: "rijnswijk", active: true },
            { verbose: "Generic", matchValue: "generic", active: true }
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
            { verbose: "O - Ontwikkeling", matchValue: 1, active: true, colorCode: "purple" },
            { verbose: "T - Test", matchValue: 2, active: true, colorCode: "green" },
            { verbose: "A - Acceptatie", matchValue: 3, active: true, colorCode: "orange" },
            { verbose: "P - Productie", matchValue: 4, active: true, colorCode: "red" }
          ]
        },
        {
          verbose: "Status",
          icon: 'MdExplore',
          items: [
            { verbose: "Pending", matchValue: 0, active: true },
            { verbose: "Running", matchValue: 16, active: true },
            { verbose: "Shutting-down", matchValue: 32, active: true },
            { verbose: "Terminated", matchValue: 48, active: true },
            { verbose: "Stopping", matchValue: 64, active: true },
            { verbose: "Stopped", matchValue: 80, active: true }
          ]
        },
      ]
    };
  }

  componentDidMount() {
      var self = this;
      fetch('https://gq4yjqab1g.execute-api.eu-west-1.amazonaws.com/TEST/populate/',
          {
              headers: { 'Content-Type': 'application/json' }
          })
          .then(response => response.json())
          .then(data => self.setState({ instances: data }));
  }

  updateFilters() {
    this.setState({
      filters: this.state.filters
    });
  }

  updateSearchFilter(event) {
    this.setState({
      searchFilter: event.target.value
    });
  }

  sortInstancesBy(group) {
    this.setState({
      sortBy: group
    });
  }

  render() {
    var instances = this.state.instances
    // Filter the instances based on the filters
    .filter((instance) => {
      var returnInstance = false;

      this.state.filters.map((filterGroup) => {
        filterGroup.items.filter((filter) => {
          return filter.active; // We only need the active filters
        })
        .map((filter) => {
          // location filter
          if(filterGroup.verbose.toLowerCase() == 'locatie') {
            if(instance.location.location.toLowerCase() == filter.matchValue.toLowerCase()) {
              returnInstance = true;
            }
          }
          // region filter
          if(filterGroup.verbose.toLowerCase() == 'regio') {
            if(instance.location.availabilityZone.toLowerCase() == filter.matchValue.toLowerCase()) {
              returnInstance = true;
            }
          }
          // Environment filter
          if(filterGroup.verbose.toLowerCase() == 'omgeving') {
            if(instance.location.environment == filter.matchValue) {
              returnInstance = true;
            }
          }
          // Status filter
          if(filterGroup.verbose.toLowerCase() == 'status') {
            if(instance.instance.state == filter.matchValue) {
              returnInstance = true;
            }
          }
        });
      });

      if(returnInstance) return instance;
    })
    // Filter the instances based on the search field
    .filter((instance) => {
      // If no search filter is applied, return the instance
      if(!this.state.searchFilter) return instance;

      var returnInstance = false;

      // 'clean' the input
      var searchString = this.state.searchFilter.toLowerCase().trim();

      // Check on location
      if(instance.location.location.toLowerCase().includes(searchString)) {
        returnInstance = true;
      }
      // Check on region
      if(instance.location.availabilityZone.toLowerCase().includes(searchString)) {
        returnInstance = true;
      }
      // Check on alias
      if(instance.metadata.verbose.toLowerCase().includes(searchString)) {
        returnInstance = true;
      }
      // Check on name
      if(instance.metadata.name.toLowerCase().includes(searchString)) {
        returnInstance = true;
      }

      if(returnInstance) return instance;
    })
    // Sort the instances
    .sort((a, b) => {
      // If no sort is applied, return the instance
      if(!this.state.sortBy) return 0;

      var aValue, bValue;

      // sort by location
      if(this.state.sortBy.toLowerCase() == 'locatie') {
        aValue = a.location.location;
        bValue = b.location.location;
      }

      // sort by region
      if(this.state.sortBy.toLowerCase() == 'regio') {
        aValue = a.location.availabilityZone;
        bValue = b.location.availabilityZone;
      }

      // sort by environment
      if(this.state.sortBy.toLowerCase() == 'omgeving') {
        aValue = a.location.environment;
        bValue = b.location.environment;
      }

      // sort by status
      if(this.state.sortBy.toLowerCase() == 'status') {
        aValue = a.instance.state;
        bValue = b.instance.state;
      }

      if(aValue < bValue) return -1;
      if(aValue > bValue) return 1;
      return 0;
    })
    // Put all the instances we are left with in some HTML
    .map((instance) => {
      return <div className="col-xs-3">
        <Instance instance={instance} key={instance.metadata.instanceId}></Instance>
      </div>;
    });

    // Generate the filters
    var filters = this.state.filters.map((filterGroup) => {
      return <section className="filter-group">
        <h2>
          { filterGroup.icon == 'MdLocationOn' ? <MdLocationOn/> : null }
          { filterGroup.icon == 'MdGroupWork' ? <MdGroupWork/> : null }
          { filterGroup.icon == 'MdBlurCircular' ? <MdBlurCircular/> : null }
          { filterGroup.icon == 'MdExplore' ? <MdExplore/> : null }
          { filterGroup.verbose }
          <div className="filter-group__sort" onClick={() => { this.sortInstancesBy(filterGroup.verbose); }}>
            Sorteer op
          </div>
        </h2>
        <ul className="filters">
          {
            filterGroup.items.map((filter) => {
              return <li className="filter" onClick={() => { filter.active = !filter.active; this.updateFilters(); } }>
                <div className="filter__checkbox">
                  { filter.active ? <MdCheckBox /> : <MdCheckBoxOutlineBlank /> }
                </div>
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
              <div className="search">
                <MdSearch />
                <input
                  placeholder="Zoeken op locatie, regio, alias, name"
                  value={this.state.searchFilter}
                  onChange={this.updateSearchFilter.bind(this)}>
                </input>
              </div>
              <h1 className="title">Instances ({instances.length})</h1>
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
