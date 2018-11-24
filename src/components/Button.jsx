import React, { Component } from 'react';
import Ripple from './Ripple.jsx';
import Icon from './Icon.jsx';

const DEFAULTS = {
  rippleOpacity: 0.2,
  background: 'orange',
  borderRadius: 4,
};

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.buttonEl = React.createRef();
    this.state = { mouseOver: false, size: 0 };
  }

  componentDidMount() {
    if (this.props.rounded) {
      // const { width, height } = this.buttonEl.getBoundingClientRect();
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

      onMouseOver,
      onMouseLeave,
      onClick,

      ...domProps
    } = this.props;
    const { size } = this.state;

    return (
      <button
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
        }}
        className={`md2-button ${className ? className : ''}`}
        onMouseOver={(event) => {
          this.setState({ mouseOver: true });
          if (onMouseOver) onMouseOver(event);
        }}
        onMouseLeave={(event) => {
          this.setState({ mouseOver: false });
          if (onMouseLeave) onMouseLeave(event);
        }}
        onClick={onClick ? onClick : undefined}
        {...domProps}>

        <Ripple style={rippleStyle}
          inner rippleTime={280}
          color={rippleColor && rippleColor}
          opacity={rippleOpacity ? rippleOpacity :
            DEFAULTS.rippleOpacity} />
        {this.props.icon ?

          <Icon name={icon} /> : this.props.children}
      </button>
    )
  }
}


const buttonStyle = {
  borderRadius: DEFAULTS.borderRadius,
};
