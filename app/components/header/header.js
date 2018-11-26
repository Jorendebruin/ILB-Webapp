import React from 'react';

import {
  FaBeer
} from 'react-icons/fa';

import {
  MdCheckBox,
  MdCheckBoxOutlineBlank
} from 'react-icons/md';

export default class MainHeader extends React.Component {

  constructor() {
    super();

    this.state = {
      nightModus: (JSON.parse(localStorage.getItem('nightModus')) == true ? true : false)
    }
  }

  componentWillMount() {
    this.toggleNightModus(!this.state.nightModus);
  }

  toggleNightModus(state) {
    this.setState({
      nightModus: !state
    });

    // Toggle a class on the body so we can add styling
    var elem = document.getElementsByTagName('body')[0];
    !state ? elem.classList.add('dark') : elem.classList.remove('dark');

    // Update the localStorage
    localStorage.setItem('nightModus', JSON.stringify(!state));
  }

  render() {
    return (
      <header className="main-header row between-xs">
        <div className="branding col-xs-5">
          <FaBeer />
          ILB-webapp
        </div>
        <div className="night-modus col-xs-2" onClick={() => { this.toggleNightModus(this.state.nightModus); } }>
          {this.state.nightModus ? <MdCheckBox /> : <MdCheckBoxOutlineBlank/> }
          Night modus
        </div>
      </header>
    )
  }
}
