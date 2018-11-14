import React from 'react';
import { Router, Link } from 'react-router';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = { showMenu: false }
  }

  render() {
    return (
      <main>
        {this.props.children}
      </main>
    );
  }
}
