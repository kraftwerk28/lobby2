import React, { Component, createRef } from 'react';

import { CSSTransition } from 'react-transition-group';
import Typed from 'typed.js';
import HomeSkillGroup from './HomeSkillGroup';
import Button from '../Button';

import octocat from '../../assets/octocat.png';
import telegram from '../../assets/telegram.png';
import facebook from '../../assets/facebook.png';
import Modal from '../Modal';
import Icon from '../Icon';

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
        // this.typed.reset()
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

    fetch('/homepage.json')
      .then(d => d.json())
      .then(d => {
        const time = (new Date()).getHours();
        let timeStr = '';

        if (time < 4)
          timeStr = 'night';
        else if (time < 12)
          timeStr = 'morning';
        else if (time < 18)
          timeStr = 'afternoon';
        else if (time < 22)
          timeStr = 'evening';
        else
          timeStr = 'night';

        d.about = d.about.map(v => v.replace(/\$TIME/, timeStr));
        return d;
      })
      .then(d => {
        this.data = d;
        this.skillsCount = Object.keys(this.data.skills).length;
        props.onBioTyped();
        const timg = (num) => props.typeBio ? num : 0;

        this.typed = new Typed('#typed1', {
          strings: this.data.about,
          // stringsElement: '#typed1static',
          // stringsElement: '#typed1strings',
          typeSpeed: timg(30),
          backSpeed: timg(50),
          backDelay: timg(100),
          cursorChar: '-',
          onComplete: () => {
            this.typed = new Typed('#typed2', {
              strings: [this.data.skillsTitle],
              // stringsElement: 'typed1',
              startDelay: timg(300),
              typeSpeed: timg(40),
              onComplete: this.showSkills,
            });
          }
        });

        // this.forceUpdate(() => { })

        // this.forceUpdate()
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


        {/* <Modal headerText='Feedback'>
          <div>hi there!</div>
        </Modal> */}
        {/* about me */}
        <div>
          <span id='typed1'>{}</span>
        </div>

        {/* echo $MY_SKILLS */}
        <div>
          <h3 style={{ display: 'inline-block' }} id='typed2'></h3>
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
            <Button onClick={this.props.onMenuOpen}>
              <Icon name='arrow_back' />
              View projects
            </Button>
            <Button
              href="https://github.com/kraftwerk28"
              style={{ padding: 2 }}
            >
              <img src={octocat} className='top-link-btn' />
            </Button>
            <Button
              href="https://t.me/kraftwerk28"
              style={{ padding: 2 }}
            >
              <img src={telegram} className='top-link-btn' />
            </Button>
            <Button
              href="https://www.facebook.com/vsevolod.zerda.1"
              style={{ padding: 2 }}
            >
              <img src={facebook} className='top-link-btn' />
            </Button>
          </div>
        )}
      </div>
    );
  }
}
