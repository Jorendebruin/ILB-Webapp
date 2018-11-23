import React from 'react';
import ReactDOM from 'react-dom';


export default class InstanceOverview extends React.Component {

    constructor(props) {
        super();
    }

    render() {

        return (
            <div className="detailOverview">
                <div className="regionBar">
                </div>
                <div className="dataOverview">
                    <h2>Meta Data</h2>
                    <p>Name: {this.props.instance.metadata.name}</p>
                    <p>Instance ID: {this.props.instance.metadata.instanceId}</p>
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