import React, { Component } from 'react';
import Ripple from '../Ripple';
import Base from './SdMenuChild';
import Button from '../Button';
import { CSSTransition as Transition } from 'react-transition-group';

export default class NestedChild extends Base {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState((prev) => ({
      expanded: !prev.expanded,
    }));
  }


  render() {
    return (
      <div ref={e => { this.DOMel = e; }}
        onClick={this.toggleExpand}
        style={{
          position: 'relative',
          borderRadius: `
            0px ${this.borderRadius}px ${this.borderRadius}px 0px`
        }}
        className='sd-menu-child'>
        <Button rounded
          transparent
          icon='chevron_right'
          rippleOpacity={0.5}
          rippleColor='#fff'
          style={{
            margin: 0,
            padding: 0,
            transform: `rotate(${this.state.expanded ? 90 : 0}deg)`,
            transition: 'transform .3s'
          }}
          onClick={this.toggleExpand}
        >
        </Button>
        <Ripple inner />
        {this.props.title}
        <Transition
          in={this.state.expanded}
          classNames='sm-expand'
          timeout={300}
          unmountOnExit
          onEntered={() => {
            console.log('enter');
          }}
        >
          <div
            style={{
              position: 'absolute',
              height: 200,
              width: 50,
              background: '#f3a',
            }}
          ></div>
        </Transition>
      </div>
    );
  }
}
