import React from 'react';
import ReactDOM from 'react-dom';


export default class InstanceOverview extends React.Component {

    constructor(props) {
        super();
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
                    <div className="regionBar">
                        {this.props.currentInstance.metadata.name}
                    </div>
                </div>

                <div className="row">
                    <div className="col-1 card-metadata card-1">
                      <div className="dataOverview">
                          <ul className="instanceList">
                              <li className="listHead">Meta Data</li>
                              <br></br>
                              <li className="listItem">Name: {this.props.currentInstance.metadata.name}</li>
                              <li className="listItem">Instance ID: {this.props.currentInstance.metadata.instanceId}</li>
                              <br></br><br></br>
                              <li className="listItem">Location: {this.props.currentInstance.location.branch} </li>
                              <br></br>
                              <li className="listItem">Environment: {environment} </li>
                              <li className="listItem">Availability Zone: {this.props.currentInstance.location.availabilityZone} </li>
                              <br></br><br></br>
                              <li className="listItem">Status: {instanceStateVerbose} </li>

                              <br></br>
                              <li className="listItem">Health: {healthState} </li>
                              <li className="listItem">Health checks: {healthChecks} </li>
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
