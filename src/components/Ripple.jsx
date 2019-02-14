import React, { Component } from 'react';
const { ceil, sqrt, round, abs, max } = Math;

const DEFAULTS = {
  opacity: 0.5,
  color: '#333',
  fadeTime: 200,
  opacityDelay: 100,
  rippleTime: 500,
};

export default class Ripple extends Component {
  constructor(props) {
    super(props);
    this.boundElement = React.createRef();
    this.raiseTimeout = null;
    this.state = {
      rippleLeft: 0,
      rippleTop: 0,
      size: 0,
      raising: false,
      clicked: false,
    };
    this.mDownHandler = this.mDownHandler.bind(this);
    this.tDownHandler = this.tDownHandler.bind(this);
    this.mUpHandler = this.mUpHandler.bind(this);
    this.rippleStart = this.rippleStart.bind(this);
  }

  // mousedown
  mDownHandler(e) {
    e.persist();
    this.rippleStart(e);
  }

  // touchdown
  tDownHandler(e) {
    e.persist();
    this.rippleStart({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
  }

  // mouseup
  mUpHandler() {
    this.setState({
      clicked: false,
    });
  }

  rippleStart({ clientX, clientY }) {
    if (this.state.raising) {
      clearTimeout(this.raiseTimeout);
      this.setState(
        { raising: false },
        () => this.rippleStart({ clientX, clientY }));
    } else {
      const { left, top, width, height } =
        this.boundElement.getBoundingClientRect(),

        absX = clientX - left,
        absY = clientY - top,

        szX = max(width - absX, absX),
        szY = max(height - absY, absY);

      const size = ceil(sqrt(szX ** 2 + szY ** 2) * 2);

      this.setState({
        size,
        raising: true,
        clicked: true,
      }, () => {
        this.setState({
          rippleTop: absY - round(this.state.size / 2),
          rippleLeft: absX - round(this.state.size / 2),
        });
      });
      this.raiseTimeout = setTimeout(() => {
        if (!this.state.clicked)
          this.setState({ raising: false });
      }, this.props.rippleSpeed || 500);
    }
  }

  componentDidMount() {
    const { width, height } = this.boundElement.getBoundingClientRect();
    const size = ceil(sqrt(width ** 2 + height ** 2) * 2);
    this.setState({ size });
  }

  render() {
    return (
      <div
        ref={(el) => { this.boundElement = el; }}
        style={{
          ...this.props.inner ? innerContainerStyle : containerStyle,
          ...this.props.style
        }}

        {...window.isMobile ?
          {
            onTouchStart: this.tDownHandler,
            onTouchEnd: this.mUpHandler
          } : {
            onMouseDown: this.mDownHandler,
            onMouseUp: this.mUpHandler,
            onMouseLeave: this.mUpHandler,
          }
        }
      >
        {this.props.children}
        < div
          style={{
            ...rippleStyle,
            background: this.props.color || DEFAULTS.color,
            opacity: this.state.clicked ?
              (this.props.opacity || DEFAULTS.opacity) : 0,
            transitionProperty: 'opacity, transform',

            transitionDuration: `
            ${this.state.clicked ?
                0 : (this.props.fadeSpeed || DEFAULTS.fadeTime)}ms,
            ${this.state.clicked ?
                (this.props.rippleSpeed || DEFAULTS.rippleTime) : 0}ms`,

            transitionDelay: `${(!this.state.clicked && this.state.raising) ?
              this.props.opacityDelay || DEFAULTS.opacityDelay : 0}ms, 0ms`,

            transform: `
              scale(${this.state.raising ? 1 : 0})
            `,
            left: this.state.rippleLeft + 'px',
            top: this.state.rippleTop + 'px',
            width: this.state.size + 'px',
            height: this.state.size + 'px',
          }}
        />
      </div >
    );
  }
}

const containerStyle = {
  overflow: 'hidden',
  position: 'relative',
  boxSizing: 'border-box',
};

const innerContainerStyle = {
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: 'inherit',
};

const rippleStyle = {
  position: 'absolute',
  borderRadius: '50%',
  pointerEvents: 'none',
  userSelect: 'none',
  transitionTimingFunction: 'cubic-bezier(0, 0, 0, 1)',
  // transitionTimingFunction: 'linear',
};
