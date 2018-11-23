import React from 'react';
import { Router } from 'react-router';

import AWS from 'aws-sdk/global';

import MainHeader from '../header/header';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = { showMenu: false }
  }

  componentDidMount() {
    AWS.config.region = 'eu-west-1' // your region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-west-1:ef5b9a78-09d0-4a30-9520-e6ffba3ab9fe'
    });
  }

  render() {
    return (
      <div className="wrapper">
        <MainHeader></MainHeader>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}
