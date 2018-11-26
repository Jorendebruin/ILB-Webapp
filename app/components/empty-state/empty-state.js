import React from 'react';

export default class EmptyState extends React.Component {
  constructor(props) {
    super();
    this.state = props;
  }

  render() {
    return (
      <section className="c-empty-state">
        <h1 className="c-empty-state__title">
          { this.state.title }
        </h1>
        <span className="c-empty-state__subtitle">
          { this.state.subtitle }
        </span>
      </section>
    )
  }
}
