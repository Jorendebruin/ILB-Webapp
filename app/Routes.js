import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Home from "./components/home/home";
import NotFound from "./components/notfound/notfound";
import Login from "./components/login/login";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import createHistory from "history/createBrowserHistory";

const history = createHistory();

export default ({ childProps }) => {
  return (
    <Router history={history}>
      <Switch>
        {/* Verwijder deze route voor authenticatie en Login, en uncomment de lines hieronder */}
        <Route exact path="/" component={Home} props={childProps} />

        {/* Uncomment de volgende lines voor authenticatie/login */}
        {/* <AuthenticatedRoute exact path="/" component={Home} props={childProps} /> */}
        {/* <UnauthenticatedRoute exact path="/login" component={Login} props={childProps} /> */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};
