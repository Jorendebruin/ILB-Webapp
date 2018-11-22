import React from 'react';

export default class Home extends React.Component {
    constructor(props) {
        super();
        this.state = {
            instance: props.instance,
            showPopup: false
        }
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
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
            <div className="detailOverview">
                <div className="regionBar">
                </div>
                <div className="dataOverview">
                    <h2>Meta Data</h2>
                    <p>Name:</p>
                    <p>Instance ID</p>
                    <br></br>
                    <h2>Location</h2>
                    <p>Regio</p>
                    <p>Omgeving</p>
                    <p>Status</p>
                    <br></br>
                    <h2>Instance</h2>
                    <p>Instance type</p>
                    <p>Runtime</p>
                    <p>Availability zone</p>
                    <br></br>
                    <h2>Status</h2>
                    <p>Health</p>
                    <p>Alarm</p>
                </div>
                <div className="logs">
                    <h1>Log</h1>
                    <table>
                        <th>
                            <tr></tr>
                            <tr></tr>
                            <tr></tr>
                        </th>
                        <td>
                            <tr></tr>
                        </td>
                    </table>
                </div>
            </div>
        );
    }
}