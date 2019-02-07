import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Auth } from "aws-amplify";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      email: "",
      password: "",
      user: undefined,
      session: undefined
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    try {
      const user = await Auth.signIn(this.state.email, this.state.password);
      console.log(user);
      if (user) {
        const session = Auth.currentSession();
        console.log(session);
        /*  await Auth.completeNewPassword(user, this.state.password, {
          birthdate: "15-05-1990",
          family_name: "Dienaar",
          gender: "Male",
          given_name: "Alex",
          middle_name: "Alex",
          name: "Alex"
        }); */
      }
      this.props.userHasAuthenticated(true);

      const fedCreds = await Auth.currentCredentials;
      /* AWS.config.update({
        region: "eu-west-1",
        credentials: fedCreds,
        apiVersions: {
          dynamodb: "2012-08-10"
        }
      }); */

      this.props.setUserName(this.state.email);
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
    }
  };

  handleSignUp = async event => {};

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="user" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="string"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
        <form onSubmit={this.handleSignUp}>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            SignUp
          </Button>
        </form>
      </div>
    );
  }
}
