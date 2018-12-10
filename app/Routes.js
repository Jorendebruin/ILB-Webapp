import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/home/home";
import NotFound from "./components/notfound/notfound"
import Login from './components/login/login';
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/" exact component={Home} props={childProps} />
      <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <Route component={NotFound} />
  </Switch>;
