import React from 'react';

import axios from 'axios';

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

import EmptyState from '../empty-state/empty-state';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchedInstances: false,
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
            { verbose: "Rijnsburg", matchValue: "rijnsburg", active: true },
            { verbose: "Generic", matchValue: "generic", active: true }
          ]
        },
        {
          verbose: "Availability zone",
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
      var gateway_url = "https://gq4yjqab1g.execute-api.eu-west-1.amazonaws.com/TEST/";
      // this.timer = setInterval(() =>
      axios.get(gateway_url + 'populate/', {
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => {
        console.log(response.data);
        self.setState({ instances: response.data, fetchedInstances: true });
        // for (let i = 0; i < response.data.length; i++)
        // {
        //   var id = response.data[i].metadata.instanceId;
        //   axios.get(gateway_url + 'pollstatus/?ID=' + id, {
        //     headers: { 'Content-Type': 'application/json' }
        //   }).then(res => 
        //   {
        //     console.log(res.data)
        //     console.log(response.data[i])
        //     if( res.data.h == 2 | res.data.h == 1)
        //     {
        //     self.state.instances[i].status.health.passed = res.data.h;
        //     }
        //     else 
        //     { self.state.instances[i].status.health.passed = 0;}
        //     self.state.instances[i].status.health.amount = 2;
        //     self.setState({ instances: self.state.instances });
        //   });
        // }
      })
      .catch(error => {
        console.log('error', error);
      });
      // , 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateFilters() {
    this.setState({ filters: this.state.filters });
  }

  updateSearchFilter(event) {
    this.setState({ searchFilter: event.target.value });
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
      var locationFilter = false;
      var availabilityZoneFilter = false;
      var environmentFilter = false;
      var statusFilter = false;

      this.state.filters.map((filterGroup) => {
        filterGroup.items.filter((filter) => {
          return filter.active; // We only need the active filters
        })
        .map((filter) => {
          // location filter
          if(filterGroup.verbose.toLowerCase() == 'locatie') {
            if(instance.location.branch.toLowerCase() == filter.matchValue.toLowerCase()) {
              locationFilter = true;
            }
          }
          // region filter
          if(filterGroup.verbose.toLowerCase() == 'availability zone') {
            if(instance.location.availabilityZone.toLowerCase() == filter.matchValue.toLowerCase()) {
              availabilityZoneFilter = true;
            }
          }
          // Environment filter
          if(filterGroup.verbose.toLowerCase() == 'omgeving') {
            if(instance.location.environment == filter.matchValue) {
              environmentFilter = true;
            }
          }
          // Status filter
          if(filterGroup.verbose.toLowerCase() == 'status') {
            if(instance.instance.state == filter.matchValue) {
              statusFilter = true;
            }
          }
        });
      });

      if(locationFilter && availabilityZoneFilter && environmentFilter && statusFilter)
        return instance;
    })
    // Filter the instances based on the search field
    .filter((instance) => {
      // If no search filter is applied, return the instance
      if(!this.state.searchFilter) return instance;

      var returnInstance = false;

      // 'clean' the input
      var searchString = this.state.searchFilter.toLowerCase().trim();

      // Check on location
      if(instance.location.branch.toLowerCase().includes(searchString)) {
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
        aValue = a.location.branch;
        bValue = b.location.branch;
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
    });

    // Put all the instances we are left with in some HTML
    var htmlFormattedInstances = instances.map((instance) => {
      return <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2" key={instance.metadata.instanceId}>
        <Instance instance={instance}></Instance>
      </div>;
    });

    // Generate the filters
    var filters = this.state.filters.map((filterGroup) => {
      return <section key={filterGroup.verbose} className="filter-group">
        <h2>
          { filterGroup.icon == 'MdLocationOn' ? <MdLocationOn/> : null }
          { filterGroup.icon == 'MdGroupWork' ? <MdGroupWork/> : null }
          { filterGroup.icon == 'MdBlurCircular' ? <MdBlurCircular/> : null }
          { filterGroup.icon == 'MdExplore' ? <MdExplore/> : null }
          { filterGroup.verbose }
          <div className="filter-group__sort" onClick={() => { this.sortInstancesBy(filterGroup.verbose); }}>
            Sorteer
          </div>
        </h2>
        <ul className="filters">
          {
            filterGroup.items.map((filter) => {
              var amountLeft = 0;
              switch(filterGroup.verbose.toLowerCase()) {
                case 'locatie':
                  amountLeft = instances.filter((instance) => {
                    if(!filter.active) return;
                    return (instance.location.branch.toLowerCase()) == filter.matchValue;
                  }).length;
                  break;
                case 'availability zone':
                  amountLeft = instances.filter((instance) => {
                    if(!filter.active) return;
                    return (instance.location.availabilityZone.toLowerCase()) == filter.matchValue;
                  }).length;
                  break;
                case 'omgeving':
                  amountLeft = instances.filter((instance) => {
                    if(!filter.active) return;
                    return instance.location.environment == filter.matchValue;
                  }).length;
                  break;
                case 'status':
                  amountLeft = instances.filter((instance) => {
                    if(!filter.active) return;
                    return instance.instance.state == filter.matchValue;
                  }).length;
                  break;
              }
              return <li key={filter.verbose} className="filter" onClick={() => { filter.active = !filter.active; this.updateFilters(); } }>
                <div className="filter__checkbox">
                  { filter.active ? <MdCheckBox /> : <MdCheckBoxOutlineBlank /> }
                </div>
                { filter.colorCode != undefined ? <span className={`filter__color filter__color--${filter.colorCode}`}></span> : null }
                <div>
                  { filter.verbose }
                </div>
                <span className="filter__amount-left">
                  ({ amountLeft })
                </span>
              </li>
            })
          }
        </ul>
      </section>
    });

    return (
      <div className="homePage row">
        <section className="col-xs-9 c-scrollable">
          <section className="row">
            <div className="col-xs-12">
              <div className="search">
                <MdSearch />
                <input
                  placeholder="Zoeken op locatie, availability zone, alias, name"
                  value={this.state.searchFilter}
                  onChange={this.updateSearchFilter.bind(this)}>
                </input>
              </div>
              <h1 className="title">Instances ({instances.length})</h1>
            </div>
          </section>
          <section className="row scroll-overflow">
            { !this.state.fetchedInstances ? <EmptyState title="Loading" subtitle="Getting instances from AWS"></EmptyState> : null }
            { this.state.fetchedInstances && htmlFormattedInstances.length == 0 ? <EmptyState title="Much empty" subtitle="No instances found with current filters"></EmptyState> : null }
            { htmlFormattedInstances }
          </section>
        </section>
        <aside className="c-sidebar col-xs-3">
          <h1>Filters</h1>
          { filters }
        </aside>
      </div>
    );
  }
}
