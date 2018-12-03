import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import {
  MdClose,
  MdEdit
} from 'react-icons/md';

export default class InstanceOverview extends React.Component {

  constructor(props) {
    super();
    this.state = {
        alias: 	props.currentInstance.metadata.verbose,
	      value: ''
    }
	   this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  editAliasInstance() {
	     document.getElementById("inputAlias_" + this.props.currentInstance.metadata.instanceId).style.display = "inherit";
  }

  postAliasInstance() {
  	const Alias_gateway_url = "https://9ptub4glw2.execute-api.eu-west-1.amazonaws.com/Testing/";
  	var instanceIdTemp = this.props.currentInstance.metadata.instanceId;
  	var instanceAliasTemp = this.state.value;

    // Hide input element
    document.getElementById("inputAlias_" + this.props.currentInstance.metadata.instanceId).style.display = "none";

  	axios.post( Alias_gateway_url,
	  {
			InstanceId: instanceIdTemp,
			InstanceAlias: instanceAliasTemp
	  })
  	.then((response) => {
  		this.props.currentInstance.metadata.verbose = instanceAliasTemp;
      this.setState({ alias: instanceAliasTemp });
  	})
  	.catch((error) => {
  	  console.log('Alias POST error: ', error);
  	});
  }

    unmount() {
        ReactDOM.unmountComponentAtNode(this.container);
    }

    render() {

        var environment;
        switch (this.props.currentInstance.location.environment) {
            case 1:
                environment = 'Development';
                break;
            case 2:
                environment = 'Test';
                break;
            case 3:
                environment = 'Acceptation';
                break;
            case 4:
                environment = 'Production';
                break;
        }

        var instanceStateVerbose;
        switch (this.props.currentInstance.instance.state) {
            case 0:
                instanceStateVerbose = 'Pending';
                break;
            case 16:
                instanceStateVerbose = 'Running';
                break;
            case 32:
                instanceStateVerbose = 'Shutting-down';
                break;
            case 48:
                instanceStateVerbose = 'Terminated';
                break;
            case 64:
                instanceStateVerbose = 'Stopping';
                break;
            case 80:
                instanceStateVerbose = 'Stopped';
                break;
        }

        var healthChecks;
        var healthState;
           switch (this.props.currentInstance.status.health.state) {
            case 0:
                healthChecks = 'Not Applicable';
                healthState = 'Inactive';
                break;
            case 1:
                healthChecks = 'Initializing';
                healthState = 'Warning';
                break;
            case 2:
                healthChecks = `${this.props.currentInstance.status.health.passed}/${this.props.currentInstance.status.health.amount}`;
                healthState = this.props.currentInstance.status.health.passed < this.props.currentInstance.status.health.amount ? 'error' : 'ok';
                break;
        }

        return (

            <div className="detailOverview">
              <div className="container">

                <div className="row">
                    <div className="regionBar">{this.props.currentInstance.metadata.verbose}<div className="editAliasButton"><MdEdit onClick={() => this.editAliasInstance()} /></div>
                        <div id={"inputAlias_" + this.props.currentInstance.metadata.instanceId} hidden>
                          <input type='text' id='userInput' defaultValue={this.props.currentInstance.metadata.verbose} onChange={this.handleChange} />
                          <input type='button' onClick={() => this.postAliasInstance() } value='Save'/>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-1 card-metadata card-1">
                      <div className="dataOverview">
                          <ul className="instanceList">
                              <li className="listHead">Meta Data</li>
                              <br></br>
                              <li className="listItem">Name<div className="liData">{this.props.currentInstance.metadata.name}</div></li>
                              <li className="listItem">Instance ID<div className="liData">{this.props.currentInstance.metadata.instanceId}</div></li>
                              <br></br>
                              <li className="listHead">Location</li>
                              <br></br>
                              <li className="listItem">Location<div className="liData">{this.props.currentInstance.location.branch}</div></li>
                              <li className="listItem">Environment<div className="liData">{environment}</div></li>
                              <li className="listItem">Availability Zone<div className="liData">{this.props.currentInstance.location.availabilityZone}</div></li>
                              <br></br>
                              <li className="listHead">Status</li>
                              <br></br>
                              <li className="listItem">Status<div className="liData">{instanceStateVerbose}</div></li>
                              <li className="listItem">Health<div className="liData">{healthState}</div></li>
                              <li className="listItem">Health checks<div className="liData">{healthChecks}</div></li>
                          </ul>
                      </div>
                    </div>

                    <div className="col">
                      <div className="logs">
                          <h1>Log</h1>
                          <br></br>
                          <div className="card-logs card-1">
                            <table className="logTable">
                                <tr>
                                    <th>Time</th>
                                    <th>Action</th>
                                    <th>User</th>
                                </tr>
                                <tr>
                                    <td>Midnight</td>
                                    <td>Stop Instance</td>
                                    <td>Henk</td>
                                </tr>
                                <tr>
                                    <td>Noon</td>
                                    <td>Start Instance</td>
                                    <td>Henk</td>
                                </tr>
                                <tr>
                                    <td>Mornin</td>
                                    <td>Stop Instance</td>
                                    <td>Henk</td>
                                </tr>
                            </table>
                          </div>
                      </div>
                      </div>
              </div>
              </div>
              </div>

        );
    }
}
