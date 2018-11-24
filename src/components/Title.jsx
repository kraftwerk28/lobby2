import React, { Component } from 'react';
import MenuBtn from './MenuButton';
import { CSSTransition, Transition } from 'react-transition-group';

const timeout = 500;
const style = {
  transition: `transform ${timeout}ms, opacity ${timeout}ms`,
}

const styles = {
  entering: {
    transform: 'translateY(-100px)',
    opacity: 0,
  },
  entered: {
    transform: 'translateY(0px)',
    opacity: 1,
  },
  exiting: {
    transform: 'translateY(-100px)',
    opacity: 0,
  }
}

export default class Title extends Component {
  constructor(props) {
    super(props);
    this.prevTitle = props.text;
  }

  // componentDidMount() {
  //   console.log(object);
  // }

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
            <h2>
              {(state === 'entering') || (state === 'exiting') ?
                this.prevTitle : this.props.text}
            </h2>
          </div>
        )}
      </Transition>
    )
  }
}
