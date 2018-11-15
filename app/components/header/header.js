import React from 'react';

import {
  FaBeer
} from 'react-icons/fa';

export default class MainHeader extends React.Component {
  render() {
    return (
      <header className="main-header row">
        <div className="branding col-xs-5">
          <FaBeer />
          ILB-webapp
        </div>
      </header>
    )
  }
}
