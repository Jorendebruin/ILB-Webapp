import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Home from "./components/home/home";
import NotFound from "./components/notfound/notfound"
import Login from './components/login/login';
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

export default ({ childProps }) => {
  return (
    <Router history={history}>
      <Switch>
        <AuthenticatedRoute path="/" exact component={Home} props={childProps} />
        <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};
