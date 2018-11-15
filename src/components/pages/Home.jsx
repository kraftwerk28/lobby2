import React, { Component, createRef } from 'react';
import MenuBtn from '../MenuButton';

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
      <div className='home-containter'>
        {/* <div className='home-title'>
          <MenuBtn />
          {this.data.title}
        </div> */}
        <div>{this.data.about}</div>
      </div>
    )
  }
}
