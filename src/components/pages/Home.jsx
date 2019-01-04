import React, { Component, createRef } from 'react';

import { CSSTransition } from 'react-transition-group';
import Typed from 'typed.js';
import HomeSkillGroup from './HomeSkillGroup';
import Button from '../Button';

import octocat from '../../assets/octocat.png';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.data = {};
    this.typed = null;
    this.skillsCount = null;
    this.enteredCount = 0;
    this.typedPassed = false;
    this.keyListener = (e) => {
      if (!this.typedPassed && e.key === 'p' || e.key === 'з') {
        // this.typed.reset();
        this.typedPassed = true;
        this.typed.typeSpeed = 0;
        this.typed.backSpeed = 0;
      }
    };

    this.state = {
      showSkills: false,
      allEntered: false,
    };

    this.showSkills = this.showSkills.bind(this);
    this.enteredHandler = this.enteredHandler.bind(this);

    fetch('data/homepage.json')
      .then(d => d.json())
      .then(d => {
        this.data = d;
        this.skillsCount = Object.keys(this.data.skills).length;
        this.typed = new Typed('#typed1', {
          strings: this.data.about,
          // stringsElement: '#typed1static',
          // stringsElement: '#typed1strings',
          typeSpeed: 30,
          backSpeed: 50,
          backDelay: 100,
          cursorChar: '-',
          onComplete: () => {
            this.typed = new Typed('#typed2', {
              strings: ['echo $MY_SKILLS'],
              // stringsElement: 'typed1',
              startDelay: 300,
              typeSpeed: 60,
              onComplete: this.showSkills,
            })
          }
        });
        this.forceUpdate(() => { });

        // this.forceUpdate();
      });
  }

  componentDidMount() {
    document.addEventListener('keypress', this.keyListener);
  }

  showSkills() {
    this.setState({ showSkills: true });
  }

  enteredHandler() {
    this.enteredCount++;
    if (this.enteredCount === Object.keys(this.data.skills).length) {
      this.setState({ allEntered: true });
    }
  }

  componentWillUnmount() {
    this.typed.destroy();
    document.removeEventListener('keypress', this.keyListener);
  }

  render() {
    return (
      <div className='home-container'>

        {/* about me */}
        <div>
          <span id='typed1'>{}</span>
          {/* <span id='typed1static'>{this.data.about}</span> */}
        </div>

        {/* echo $MY_SKILLS */}
        <div>
          <h2 style={{ display: 'inline-block' }} id='typed2'></h2>
        </div>

        {/* skills */}
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
                onEntered={this.enteredHandler}
              />
            )}
        </div>

        {/* footer */}
        {this.state.allEntered && (
          <div className='bottom-div'>
            <Button onClick={this.props.onMenuOpen}>&lt;- View projects</Button>
            <Button href="https://github.com/kraftwerk28" style={{ padding: 2 }}>
              <img src={octocat} className='octocat' />
            </Button>
          </div>
        )}
      </div>
    )
  }
}
