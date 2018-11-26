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
                        <li className="listItem">Name: {this.props.instance.metadata.name}</li>
                        <li className="listItem">Instance ID: {this.props.instance.metadata.instanceId}</li>
                        <li className="listHead">Location</li>
                        <li className="listItem">Regio: </li>
                        <li className="listItem">Omgeving: </li>
                        <li className="listItem">Status: </li>
                        <li className="listHead">Instance</li>
                        <li className="listItem">Instance Type: </li>
                        <li className="listItem">Runtime: </li>
                        <li className="listItem">Availability Zone: </li>
                        <li className="listHead">Status</li>
                        <li className="listItem">Health: </li>
                        <li className="listItem">Alarm: </li>
                    </ul>
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