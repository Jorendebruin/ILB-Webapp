import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./components/home/home";
import NotFound from "./components/notfound/notfound"
import Login from './components/login/login';
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>

    // Verwijder deze route voor authenticatie en Login, en uncomment de lines hieronder
    <Route exact path="/" component={Home} props={childProps}  />

    // Uncomment de volgende lines voor authenticatie/login
    // <AuthenticatedRoute exact path="/" component={Home} props={childProps} />
      // <UnauthenticatedRoute exact path="/login" component={Login} props={childProps} />
    <Route component={NotFound} />
  </Switch>;
