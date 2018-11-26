import React, { Component, createRef } from 'react';
import Ripple from '../Ripple.jsx';

export default class SdMenuChild extends Component {
  constructor(props) {
    super(props);
    this.borderRadius = 0;
    this.DOMel = createRef();
  }

  componentDidMount() {
    const { floor, min } = Math;
    const width = this.DOMel.offsetWidth;
    const height = this.DOMel.offsetHeight;
    this.borderRadius = floor(min(width, height) / 2);
    this.forceUpdate();
  }

  render() {
    const { text, onClick, sub, style } = this.props;


    return (
      <div ref={e => { this.DOMel = e; }}
        style={{
          ...style,
          position: 'relative',
          borderRadius: `
            0px ${this.borderRadius}px ${this.borderRadius}px 0px`,
        }}
        className={'sd-menu-child' + (sub ? '-sub' : '')}
        onClick={onClick ? onClick : undefined}
      >
        {text}
        <Ripple inner color='white' />
      </div>
    );
  }
}
