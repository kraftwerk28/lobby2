import React, { Component } from 'react';
import MenuBtn from './MenuButton';
import { CSSTransition, Transition } from 'react-transition-group';

const timeout = 500;
const style = {
  transition: `transform ${timeout}ms`
}

const styles = {
  entering: {
    transform: 'translateY(-100px)',
  },
  exiting: {
    transform: 'translateY(-100px)',
  }
}

export default class Title extends Component {
  constructor(props) {
    super(props);
    this.prevTitle = props.text;
  };

  render() {
    return (
      <Transition in={this.props.animTrigger}
        classNames='title'
        timeout={timeout}
        unmountOnExit
        onExited={() => {
          this.prevTitle = this.props.text;
        }}
      >
        {state => (
          <div className='title'
            style={{
              ...style,
              ...styles[state]
            }}
          >
            <MenuBtn sideMenu={this.props.sideMenu} />
            {(state === 'entering') || (state === 'exiting') ?
              this.prevTitle : this.props.text}
          </div>
        )}
      </Transition>
    )
  }
}
