import React from "react";

import AWS from "aws-sdk/global";
import { Auth } from "aws-amplify";
import MainHeader from "../header/header";
import Routes from "../../Routes";

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      children: props.children,
      showMenu: false,
      isAuthenticated: false,
      username: ""
    };
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  setUserName = currentUser => {
    this.setState({ username: currentUser });
  };

  handleLogoutevent = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      username: this.state.username,
      setUserName: this.setUserName
    };
    return (
      <div className="wrapper">
        <MainHeader />
        <Routes childProps={childProps} />
      </div>
    );
  }
}
