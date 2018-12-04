import React from 'react';

import AWS from 'aws-sdk/global';
import {Auth} from 'aws-amplify';
import MainHeader from '../header/header';
import Routes from '../../Routes';

export default class App extends React.Component {

  constructor(props) {
    super();
    this.state = {
      children: props.children,
      showMenu: false,
      isAuthenticated: false,
      username: ""
    }
  }

  async componentDidMount() {
    try {

    AWS.config.update({
        region: 'eu-west-1', // your region
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'eu-west-1:ef5b9a78-09d0-4a30-9520-e6ffba3ab9fe'
        }),
        apiVersions: {
          dynamodb: '2012-08-10'
        }
      });

      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }

   this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUserName = currentUser => {
    this.setState({ username: currentUser})
  }

  handleLogoutevent = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      username: this.state.username,
      setUserName: this.setUserName
    };
    return (
      <div className="wrapper">
        <MainHeader></MainHeader>
        <Routes childProps={childProps} />
      </div>
    );
  }
}
