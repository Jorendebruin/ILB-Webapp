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

        return (
            <div className="detailOverview">
                <div className="regionBar">
                </div>
                <div className="dataOverview">
                    <ul className="instanceList">
                        <li className="listHead">Meta Data</li>
                        <br></br>
                        <li className="listItem">Name: {this.props.instance.metadata.name}</li>
                        <li className="listItem">Instance ID: {this.props.instance.metadata.instanceId}</li>
                        <br></br><br></br>
                        <li className="listHead">Location</li>
                        <br></br>
                        <li className="listItem">Regio: </li>
                        <li className="listItem">Omgeving: </li>
                        <li className="listItem">Status: </li>
                        <br></br><br></br>
                        <li className="listHead">Instance</li>
                        <br></br>
                        <li className="listItem">Instance Type: </li>
                        <li className="listItem">Runtime: </li>
                        <li className="listItem">Availability Zone: </li>
                        <br></br><br></br>
                        <li className="listHead">Status</li>
                        <br></br>
                        <li className="listItem">Health: </li>
                        <li className="listItem">Alarm: </li>
                    </ul>
                </div>
                <div className="logs">
                    <h1>Log</h1>
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
        );
    }
}