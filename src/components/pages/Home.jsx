import React, { Component, createRef } from 'react';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.data = {};

    fetch('data/homepage.json')
      .then(d => d.json())
      .then(d => {
        this.data = d;
        this.forceUpdate();
      });
  }

  render() {
    return (
      <div>
        <div>{this.data.title}</div>
        <div>{this.data.about}</div>
      </div>
    )
  }
}
