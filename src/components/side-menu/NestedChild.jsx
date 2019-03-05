import React, { Component } from 'react';
import SdMenuChild from './SdMenuChild';
import { CSSTransition, Transition } from 'react-transition-group';
import { Link } from 'react-router-dom';

const EXPAND_TIMEOUT = 1000;

export default class NestedChild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState((prev) => ({
      expanded: !prev.expanded,
    }));
  }


  render() {
    const { text, group } = this.props;
    const allText =
      <>
        <span
          className='material-icons'
          style={{
            transition: 'transform .5s',
            transform: `rotate(${this.state.expanded ? -180 : 0}deg)`,
          }}
        >expand_more</span>
        {text}
      </>;

    return (
      <>
        <SdMenuChild text={allText} onClick={this.toggleExpand} />

        <Transition
          timeout={EXPAND_TIMEOUT}
          in={this.state.expanded}
        >
          {state =>
            <div
              className='sd-menu-nested-div'
              style={{
                maxHeight: state === 'exited' || state === 'exiting' ?
                  0 : 200 + 'px',
                // display: state === 'exited' ? 'none' : null,
                transition: `max-height ${EXPAND_TIMEOUT}ms`
              }}
            >
              {group.map(({ to, text }, i) =>
                <Link
                  to={to}
                  className='def-link'
                  key={i}
                  onClick={this.props.onChildClick}
                >
                  <CSSTransition
                    classNames='sd-menu-sub-tr'
                    timeout={1000}
                    in={this.state.expanded}
                  >
                    <SdMenuChild sub text={text}
                      style={{
                        transitionDelay: i * 50 + 'ms',
                      }} />
                  </CSSTransition>
                </Link>
              )}
            </div>
          }
        </Transition>
      </>
    );
  }
}
