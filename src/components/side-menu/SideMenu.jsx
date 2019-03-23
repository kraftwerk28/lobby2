import React, {
  Component,
  createRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react'
import Ripple from '../Ripple.jsx'
import globalListener from '../../globalListener'
import defs from '../../globals'
import SdMenuChild from './SdMenuChild.jsx'
import Swipeable from 'react-swipeable'
import NestedChild from './NestedChild.jsx'
import { Link } from 'react-router-dom'

const { abs, sign } = Math

const TRIGGER_WIDTH = 8

const SideMenu = (props, ref) => {
  const menuElement = useRef()
  const overflowElement = useRef()
  let startX = null
  const [width, setWidth] = useState(500)
  const [swapping, setSwapping] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [startx, setStartx] = useState(null)
  const [x, setX] = useState(0)

  const expand = (bool) => {
    if (expanded !== bool) {
      setExpanded(bool)
      setX(0)
    }
    if (props.toBlur) {
      props.toBlur.style.filter = `blur(${bool ? 10 : 0}px)`
    }
  }

  useImperativeHandle(ref, () => ({ expand }))

  useEffect(() => {
    setWidth(menuElement.current.offsetWidth)
  }, [])

  const swipeStart = (e, deltaX, deltaY, absX, absY, velocity) => {
    if (!swapping) {
      startX = window.isMobile ? e.touches[0].clientX : e.clientX
      setSwapping(true)
      // this.setState({ swapping: true })
    }
    if (deltaX === 0)
      return
    let _x = -deltaX - (expanded ? 0 : width)
    if (_x > 0) {
      _x = 0
    }
    setX(_x)
  }

  const swipeEnd = (e, deltaX, deltaY, isFlick, velocity) => {
    if (swapping) {
      let _x = 0
      let shouldExpand = width + x >= width / 2
      if (velocity > 0.5) shouldExpand = sign(deltaX) === -1
      setSwapping(false)
      setX(_x)
      // this.setState({
      //   swapping: false, x: _x,
      // })
      expand(shouldExpand)
    }

    setSwapping(false)
    // this.setState({ swapping: false })
  }

  const child = ({ text, to, group }, key) => {
    return group
      ? (
        <NestedChild
          group={group}
          key={key}
          text={text}
          onChildClick={() => expand(false)}
        />
      )
      : (
        <Link
          to={to}
          key={key}
          className='def-link'
          onClick={() => expand(false)}
        >
          <SdMenuChild title={text} text={text} />
        </Link>
      )
  }

  const preventCloseHandler = (e) => {
    e.preventDefault()
  }

  const items = props.children

  return (
    <div style={{
      ...rootStyle,
      cursor: swapping ? 'grabbing' : 'grab'
    }}>
      {/* overflow for dimming */}
      <div
        ref={overflowElement}
        className='sd-menu-overflow'
        style={{
          ...overflowStyle,
          display: (expanded || swapping) ? 'block' : 'none',
          opacity: Math.round(100 * (width + x) / width / 2) / 100,
        }}
        onMouseUp={() => { expand(false) }}
      />

      {/* actual body */}
      <Swipeable
        trackMouse
        onSwiping={swipeStart}
        onSwiped={swipeEnd}
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
          ref={menuElement}
          style={{
            background: defs.backgroundColor,
            ...sdMenuStyle,
          }}
          onClick={preventCloseHandler}
        >
          {items && items.map(child)}
          <div>Another content will be soon...</div>
        </div>
      </Swipeable>
    </div>
  )

}

class SideMenu_ extends Component {
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

// export default SideMenu_
export default forwardRef(SideMenu)
