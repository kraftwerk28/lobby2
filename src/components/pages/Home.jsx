import React, { Component, createRef } from 'react';

import { CSSTransition } from 'react-transition-group';
import Typed from 'typed.js';
import HomeSkillGroup from './HomeSkillGroup';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.data = {};
    this.typed = null;
    this.skillsCount = null;
    this.keyListener = (e) => {
      if (e.key === 'p') {
        this.typed.reset();
      }
    };

    this.state = {
      showSkills: false,
    };

    this.showSkills = this.showSkills.bind(this);

    fetch('data/homepage.json')
      .then(d => d.json())
      .then(d => {
        this.data = d;
        this.skillsCount = Object.keys(this.data.skills).length;
        this.typed = new Typed('#typed1', {
          strings: this.data.about,
          // stringsElement: '#typed1strings',
          typeSpeed: 30,
          backSpeed: 30,
          backDelay: 0,
          cursorChar: '-',
          onComplete: () => {
            this.typed = new Typed('#typed2', {
              strings: ['My skills:'],
              startDelay: 500,
              typeSpeed: 60,
              onComplete: this.showSkills,
            })
          }
        });
        this.forceUpdate();
      });
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keyListener);
  }

  showSkills() {
    this.setState({ showSkills: true });
  }

  componentWillUnmount() {
    this.typed.destroy();
    document.removeEventListener('keypress', this.keyListener);
  }

  render() {
    return (
      <div className='home-container'>
        <div>
          <span id='typed1'></span>
        </div>
        <div>
          <h2 style={{ display: 'inline-block' }} id='typed2'></h2>
        </div>
        <div>
          {this.data.skills &&
            this.state.showSkills &&
            Object.keys(this.data.skills).map((key, index) =>
              <HomeSkillGroup
                title={key}
                key={index}
                index={index}
                count={this.skillsCount}
                subSkills={this.data.skills[key]}
              />
            )}
        </div>

      </div>
    )
  }
}
