import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Amplify from "aws-amplify";
import config from "./lib/constants/config";
import App from "./components/app/app";
import { runWithAdal } from "react-adal";
import { authContext } from "./adalConfig";

const DO_NOT_LOGIN = false;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
});

runWithAdal(
  authContext,
  () => {
    ReactDOM.render(
      <Router>
        <App />
      </Router>,
      document.getElementById("app")
    );
  },
  DO_NOT_LOGIN
);
