import React, { Component } from 'react';
import Ripple from './Ripple';
import Icon from './Icon';
import A from './MyLink';
import DEFS from '../globals.js';
import PropTypes from 'prop-types';

const DEFAULTS = {
  rippleOpacity: 0.5,
  rippleColor: '#aaa',
  background: 'transparent',
  borderRadius: 5,
};

class Wrapper extends Component {
  render = () => (
    typeof this.props.href === 'string' ?
      <A {...this.props}>{this.props.children}</A>
      :
      <button {...this.props}>{this.props.children}</button>
  )
}

class Button extends Component {
  constructor(props) {
    super(props);
    this.buttonEl = React.createRef();
    this.state = { mouseOver: false, size: 0 };
  }

  componentDidMount() {
    if (this.props.rounded) {
      // const { width, height } = this.buttonEl.getBoundingClientRect()
      const width = this.buttonEl.offsetWidth;
      const height = this.buttonEl.offsetHeight;
      const maxDim = Math.round(Math.max(width, height));
      this.setState({ size: maxDim }, () => { this.forceUpdate(); });
    }
  }

  render() {
    const {
      style,
      background,
      rippleColor,
      rippleOpacity,
      icon,
      rounded,
      transparent,
      rippleStyle,
      className,

      href,

      onMouseOver,
      onMouseLeave,
      onClick,

      ...domProps
    } = this.props;
    const { size } = this.state;

    return (
      <Wrapper
        href={href}
        ref={e => {
          this.buttonEl = e;
        }}
        style={{
          ...style ? style : buttonStyle,
          borderRadius: rounded ? '50%' : DEFAULTS.borderRadius,
          background: transparent ? 'transparent' :
            (background ? background : DEFAULTS.background),
          boxShadow: transparent ? 'none' : '',
          width: size ? size : 'auto',
          height: size ? size : 'auto',
          borderWidth: rounded ? 0 : null
        }}
        className={`md2-button ${className ? className : ''} bordered`}
        onMouseOver={(event) => {
          this.setState({ mouseOver: true });
          if (onMouseOver) onMouseOver(event);
        }}
        onMouseLeave={(event) => {
          this.setState({ mouseOver: false });
          if (onMouseLeave) onMouseLeave(event);
        }}
        onClick={onClick ? onClick : undefined}
        {...domProps}
      >

        <Ripple
          style={rippleStyle}
          inner
          rippleTime={280}
          color={rippleColor ? rippleColor : DEFAULTS.rippleColor}
          opacity={rippleOpacity ? rippleOpacity :
            DEFAULTS.rippleOpacity} />
        {this.props.icon ?
          <Icon name={icon} /> : this.props.children
        }
      </Wrapper>
    );
  }
}


const buttonStyle = {
  borderRadius: DEFAULTS.borderRadius,
};

export default Button;
