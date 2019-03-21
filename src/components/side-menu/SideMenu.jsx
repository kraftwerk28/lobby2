import React, { Component, createRef } from 'react'
import Ripple from '../Ripple.jsx'
import globalListener from '../../globalListener'
import defs from '../../globals'
import SdMenuChild from './SdMenuChild.jsx'
import Swipeable from 'react-swipeable'
import NestedChild from './NestedChild.jsx'
import { Link } from 'react-router-dom'

const { abs, sign } = Math

const TRIGGER_WIDTH = 8

export default class SideMenu extends Component {
  constructor(props) {
    super(props)

    this.menuElement = createRef()
    this.overflowElement = createRef()

    this.startX = null
    this.state = {
      width: 500,
      swapping: false,
      expanded: false,
      startx: null,
      x: 0,
    }
  }

  componentDidMount() {
    this.setState({
      width: this.menuElement.offsetWidth
    })
  }

  expand(bool) {
    if (this.state.expanded !== bool) {
      this.setState({ expanded: bool, x: 0, })
    }
    if (this.props.toBlur) {
      this.props.toBlur.style.filter = `blur(${bool ? 10 : 0}px)`
    }
  }

  swipeStart = (e, deltaX, deltaY, absX, absY, velocity) => {
    if (!this.state.swapping) {
      this.startX = window.isMobile ? e.touches[0].clientX : e.clientX
      this.setState({ swapping: true })
    }

    if (deltaX === 0)
      return

    let x = -deltaX - (this.state.expanded ? 0 : this.state.width)
    if (x > 0) {
      x = 0
    }

    this.setState({ x })
    if (this.props.toBlur) {
      this.props.toBlur.style.filter =
        `blur(${Math.round((this.width + x) / this.state.width * 10)}px)`
    }
  }

  swipeEnd = (e, deltaX, deltaY, isFlick, velocity) => {
    if (this.state.swapping) {
      let x = 0
      let shouldExpand = this.state.width + this.state.x >= this.state.width / 2
      if (velocity > 0.5) shouldExpand = sign(deltaX) === -1
      this.setState({
        swapping: false, x,
      })
      this.expand(shouldExpand)
    }

    this.setState({ swapping: false })
  }

  child({ text, to, group }, key) {
    return group ?
      (
        <NestedChild
          group={group}
          key={key}
          text={text}
          onChildClick={() => this.expand(false)}
        />
      ) : (
        <Link
          to={to}
          key={key}
          className='def-link'
          onClick={() => this.expand(false)}
        >
          <SdMenuChild title={text} text={text} />
        </Link>
      )
  }

  preventCloseHandler(e) {
    e.preventDefault()
  }

  render() {
    const {
      children: items
    } = this.props
    const {
      swapping,
      expanded,
      x,
      width
    } = this.state

    return (
      <div style={{
        ...rootStyle,
        cursor: this.state.swapping ? 'grabbing' : 'grab'
      }}>
        {/* overflow for dimming */}
        <div
          ref={e => {
            this.overflowElement = e
          }}
          className='sd-menu-overflow'
          style={{
            ...overflowStyle,
            display: (expanded || swapping) ? 'block' : 'none',
            opacity: Math.round(100 * (width + x) / width / 2) / 100,
          }}
          onMouseUp={() => { this.expand(false) }}
        />

        {/* actual body */}
        <Swipeable
          trackMouse
          onSwiping={this.swipeStart}
          onSwiped={this.swipeEnd}
          style={{
            ...triggerStyle,
            width: width + triggerStyle.paddingLeft + 'px',
            transform: `translateX(${
              swapping ? x : (expanded ? 0 : -width)
            }px)`,
            transition: `${swapping ? 0 : 300}ms`,
          }}
        >
          <div
            className='side-menu'
            ref={e => this.menuElement = e}
            style={{
              background: defs.backgroundColor,
              ...sdMenuStyle,
            }}
            onClick={this.preventCloseHandler}
          >
            {items && items.map((c, i) => this.child(c, i))}
            <div>Another content will be soon...</div>
          </div>
        </Swipeable>
      </div>
    )
  }
}

const rootStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  userSelect: 'none',
  zIndex: 10,
}

const triggerStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  paddingLeft: TRIGGER_WIDTH,
  transform: 'translateX(50px)',
  userSelect: 'none',
  zIndex: 11,
}

const overflowStyle = {
  cursor: 'default',
}

const sdMenuStyle = {
  borderLeft: 0,
  borderBottom: 0,
  borderTop: 0,
  transitionTimingFunction: 'ease-out',
  cursor: 'default',
}
