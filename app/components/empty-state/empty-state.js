import React from 'react';

export default class EmptyState extends React.Component {
  constructor(props) {
    super();
    this.state = props;
  }

  render() {
    return (
      <section className="c-empty-state">
        <h1>
          { this.state.title }
        </h1>
        <span>
          { this.state.subtitle }
        </span>
      </section>
    )
  }
}
