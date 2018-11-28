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
      isAuthenticated: false 
    }
  }

  async componentDidMount() {
    try {

    AWS.config.update({
<<<<<<< HEAD
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

  handleLogoutevent = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
=======
      region: 'eu-west-1', // your region
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-west-1:ef5b9a78-09d0-4a30-9520-e6ffba3ab9fe'
      }),
      apiVersions: {
        dynamodb: '2012-08-10'
      }
    });
>>>>>>> 95af8e3ba058cd3a62998d2334f100daa9b84043
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };
    return (
      <div className="wrapper">
        <MainHeader></MainHeader>
        <main>
          { this.state.children }
        </main>
        <Routes childProps={childProps} />
      </div>
    );
  }
}
