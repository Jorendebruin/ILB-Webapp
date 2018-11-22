import React from 'react';

import AWS from 'aws-sdk/global';

import axios from 'axios';

import PahoMQTT from 'paho-mqtt'
global.Paho = {
  MQTT: PahoMQTT
}
import AWSwebsocket from '../../lib/websocket/awswebsocket';

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
    AWS.config.region = 'eu-west-1' // your region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-west-1:ef5b9a78-09d0-4a30-9520-e6ffba3ab9fe'
    });
    this.state = {
      fetchedInstances: false,
      instances: [],
      sortBy: null,
      searchFilter: null,
      websocketConnecting: 0, // 0: inactive, 1: starting, 2: connected, 3: error
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
            // { verbose: "Shutting-down", matchValue: 32, active: true },
            // { verbose: "Terminated", matchValue: 48, active: true },
            { verbose: "Stopping", matchValue: 64, active: true },
            { verbose: "Stopped", matchValue: 80, active: true }
          ]
        },
      ]
    };
  }

  componentDidMount() {
    var gateway_url = "https://gq4yjqab1g.execute-api.eu-west-1.amazonaws.com/TEST/";
    axios.get(gateway_url + 'populate/', {
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      this.setState({ instances: response.data, fetchedInstances: true });
      this.connectToWebSocket()
    })
    .catch(error => {
      console.log('error', error);
    });

  }

  connectToWebSocket() {
    var cognitoidentity = new AWS.CognitoIdentity();

    cognitoidentity.getCredentialsForIdentity({
      IdentityId: AWS.config.credentials.params.IdentityId
    }, (err, data) => {
      if(err) return;

      var credentials = {
        accessKeyId: data.Credentials.AccessKeyId,
        secretAccessKey: data.Credentials.SecretKey,
        sessionToken: data.Credentials.SessionToken
      };

      var host = 'av0upm8irjpyk-ats.iot.eu-west-1.amazonaws.com';
      var wsUrl = new AWSwebsocket().getSignedUrl(host, 'eu-west-1', credentials);
      var client = new Paho.MQTT.Client(wsUrl, 'test-'+Math.floor(Math.random() * 1243454));
      var connectOptions = {
        useSSL: true,
        timeout: 3,
        mqttVersion: 4,
        reconnect: true,
        onSuccess: () => {
          this.setState({websocketConnecting: 2});
          client.subscribe('ilb/webapp/cloudwatch');
          client.subscribe('ilb/webapp/user');
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
        console.log(`connect loast: ${err.errorMessage}`);
      };

      client.onMessageArrived = (message) => {
        switch (message.topic) {
          case 'ilb/webapp/cloudwatch':
            this.cloudWatchActionEvent(JSON.parse(message.payloadString));
            break;
        }
      };
    });
  }

  userActionEvent(message) {

  }

  cloudWatchActionEvent(message) {
    // const instanceId = message.detail.requestParameters.instancesSet.items[0].instanceId;
    // const eventName = message.detail.eventName;
    console.log(message);
    switch (message["detail-type"]) {
      case 'EC2 Instance State-change Notification':
        this.changeInstanceState(message);
        break;
      case 'AWS API Call via CloudTrail':
        this.changeInstance(message);
      default:
        console.log("unregistered event", message);
        break;
    }
  }

  changeInstance(message) {
    switch (message.detail.eventName) {
      case 'CreateTags':
        if(message.detail.requestParameters.tagSet.items.find(tag => {return tag.key.toLowerCase() == 'name';})) {
          this.changeInstanceName(
            message.detail.requestParameters.tagSet.items.find(tag => {return tag.key.toLowerCase() == 'name';}).value,
            message.detail.requestParameters.resourcesSet.items[0].resourceId
          );
        }
        break;
    }
  }

  changeInstanceName(name, instanceId) {
    var instance = this.state.instances.find(instance => {
      return instance.metadata.instanceId == instanceId;
    });

    if(!instance) return; // When we don't have the instance, we don't care

    instance.metadata.name = name;
    this.forceUpdate();
  }

  changeInstanceState(message) {
    var instance = this.state.instances.find(instance => {
      return instance.metadata.instanceId == message.detail["instance-id"];
    });

    if(!instance) return; // When we don't have the instance, we don't care

    switch (message.detail.state) {
      case 'pending':
        instance.instance.state = 0;
        break;
      case 'running':
        instance.instance.state = 16;
        break;
      case 'stopping':
        instance.instance.state = 64;
        break;
      case 'stopped':
        instance.instance.state = 80;
        break;
    }

    this.forceUpdate();
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
            </div>
            <h1 className="title col-xs-9">
              Instances ({instances.length})
            </h1>
            <div className="col-xs-3 socket-connection">
              Live connect <span className={`o-websocket o-websocket--connection-state--${this.state.websocketConnecting}`}></span>
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
