import React from 'react';
import ReactDOM from 'react-dom';

import {
  MdClose
} from 'react-icons/md';


export default class InstanceOverview extends React.Component {

    constructor(props) {
        super();
    }

    unmount() {
        ReactDOM.unmountComponentAtNode(this.container);
    }

    close() {
      this.props.closeModal();
    }

    render() {
      console.log(this.props.currentInstance);

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
          <article className="c-instanceOverview">
            <header>
              <h1>
                { this.props.currentInstance.metadata.name }
              </h1>
              <MdClose onClick={() => this.close() }/>
            </header>
            <section className="row">
              <section className="col-xs-4">
                <div className="o-card">
                  <div className="o-card__content">
                    <h2>
                      Metadata
                    </h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Name</td>
                          <td>{this.props.currentInstance.metadata.name}</td>
                        </tr>
                        <tr>
                          <td>Instance ID</td>
                          <td>{this.props.currentInstance.metadata.instanceId}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h2>
                      Location
                    </h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Branch</td>
                          <td>{this.props.currentInstance.location.branch}</td>
                        </tr>
                        <tr>
                          <td>Environment</td>
                          <td>{environment}</td>
                        </tr>
                        <tr>
                          <td>Availability Zone</td>
                          <td>{this.props.currentInstance.location.availabilityZone}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h2>
                      Instance
                    </h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Branch</td>
                          <td>{this.props.currentInstance.instance.startuptime}</td>
                        </tr>
                        <tr>
                          <td>State</td>
                          <td>{this.props.currentInstance.instance.state}</td>
                        </tr>
                        <tr>
                          <td>Type</td>
                          <td>{this.props.currentInstance.instance.type}</td>
                        </tr>
                      </tbody>
                    </table>
                    <h2>
                      Status
                    </h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Alarm</td>
                          <td>{this.props.currentInstance.status.alarm}</td>
                        </tr>
                        <tr>
                          <td>Health</td>
                          <td>
                            {this.props.currentInstance.status.health.passed}/{this.props.currentInstance.status.health.amount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
              <section className="col-xs-8">
                <h2>
                  Logs
                </h2>
                <table className="o-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Action</th>
                      <th>By</th>
                    </tr>
                  </thead>
                </table>
              </section>
            </section>
          </article>
        );
    }
}
