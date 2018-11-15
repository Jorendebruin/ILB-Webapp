import React from 'react';
import { Router, Link } from 'react-router';

import MainHeader from '../header/header';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = { showMenu: false }
  }

  render() {
    return (
      <div className="wrapper">
        <MainHeader></MainHeader>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
}
