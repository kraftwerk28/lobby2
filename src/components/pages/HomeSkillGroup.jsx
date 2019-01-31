import React, { Component } from 'react'
import { CSSTransition, Transition } from 'react-transition-group'

const animTimeout = 1000

const DEF = {
  skillsInDiff: 100,
  subSkillsDelay: 250,
}

export default class HomeSkillGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entered: false, // just animation control
      showSubSkills: false,
      expanded: true, // if skill group is showing sub-skills
    }
    this.h3ClickHandler = this.h3ClickHandler.bind(this)
    setTimeout(() => {
      this.setState({ entered: true })
    }, (props.count * 2) * DEF.skillsInDiff +
    DEF.subSkillsDelay + 500 + animTimeout)

  }

  h3ClickHandler() {
    this.setState(prev => ({ expanded: !prev.expanded }))
  }

  render() {
    const { title, subSkills, index, count, onEntered } = this.props

    return (
      <>
        <H3
          index={index}
          text={title}
          count={count}
          onClick={this.h3ClickHandler}
        />

        {subSkills !== null &&
          <Transition
            timeout={this.state.entered ? 0 : animTimeout}
            appear
            in={this.state.expanded}
            onEntered={() => {
              setTimeout(() => {
                if (onEntered)
                  onEntered()
              }, 1000)
            }}
          >
            {state =>
              <ul
                className='skill-ul'
                style={{
                  maxHeight: state === 'entered' ? 300 : 0 + 'px',
                  // paddingTop: state === 'entered' ? 20 : 0 + 'px',
                  transition:
                    this.state.entered ? 0 :
                      `max-height ${animTimeout}ms, padding ${animTimeout}ms`,
                  transitionDelay:
                    this.state.entered ? 0 :
                      (count) * DEF.skillsInDiff + DEF.subSkillsDelay + 'ms',
                }}
              >
                {this.state.expanded && subSkills.map((val, _index) =>
                  <Li
                    count={count}
                    text={val}
                    index={_index}
                    key={_index}
                  />
                )}
              </ul>
            }
          </Transition>
        }
      </>
    )
  }

}

const H3 = props => <CSSTransition
  classNames='skill-head-tr'
  timeout={animTimeout + props.count * DEF.skillsInDiff}
  appear
  key={props.index}
  in
>
  <h3
    className='skill-h3'
    style={{
      transitionDelay: props.index * DEF.skillsInDiff + 'ms',
      cursor: 'pointer'
    }}
    onClick={undefined && props.onClick}
  >
    {props.text}
  </h3>
</CSSTransition>

const Li = props => <Transition
  timeout={animTimeout}
  appear
  in
  unmountOnExit
>
  {state =>
    <li
      className='skill-li'
      style={{
        transform: `
          translateX(${state === 'entered' ? 0 : -25}px)`,
        opacity: state === 'entered' ? 1 : 0,
        transition: `
          transform ${animTimeout}ms,
          opacity ${animTimeout}ms`,
        transformOrigin: 'top left',
        transitionDelay:
          (props.count + props.index) * DEF.skillsInDiff +
          DEF.subSkillsDelay + 500 + 'ms',
      }}
    >{props.text}</li>
  }
</Transition >
