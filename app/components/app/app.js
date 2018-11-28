import React from 'react';

import AWS from 'aws-sdk/global';

import MainHeader from '../header/header';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      children: props.children
    }
  }

  componentDidMount() {
    AWS.config.update({
      region: 'eu-west-1', // your region
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-1:ef5b9a78-09d0-4a30-9520-e6ffba3ab9fe'
      })
    });
  }

  render() {
    return (
      <div className="wrapper">
        <MainHeader></MainHeader>
        <main>
          { this.state.children }
        </main>
      </div>
    );
  }
}
