import React, { Component } from 'react';
import { CSSTransition, Transition } from 'react-transition-group';

const animTimeout = 1000;

const DEF = {
  skillsInDiff: 100,
  subSkillsDelay: 250,
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entered: false,
      showSubSkills: false,
    }
  }

  render() {
    const { title, subSkills, index, count, onEntered } = this.props;

    return (
      <>
        <H3 index={index} text={title} count={count} />

        {subSkills !== null &&
          <Transition
            timeout={animTimeout}
            appear
            in
            onEntered={() => {
              setTimeout(() => {
                if (onEntered)
                  onEntered();
              }, 1000);
            }}
          >
            {state =>
              <ul
                className='skill-ul'
                style={{
                  maxHeight: state === 'entered' ? 300 : 0 + 'px',
                  // paddingTop: state === 'entered' ? 20 : 0 + 'px',
                  transition:
                    `max-height ${animTimeout}ms, padding ${animTimeout}ms`,
                  transitionDelay:
                    (count) * DEF.skillsInDiff + DEF.subSkillsDelay + 'ms',
                }}
              >
                {subSkills.map((val, _index) =>
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
    );
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
      transitionDelay: props.index * DEF.skillsInDiff + 'ms'
    }}
  >
    {props.text}
  </h3>
</CSSTransition>

const Li = props => <Transition
  timeout={animTimeout}
  appear
  in
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
