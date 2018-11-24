import React, { Component } from 'react';
import { CSSTransition, Transition } from 'react-transition-group';

const animTimeout = 1000;

const DEF = {
  skillsInDiff: 100,
  subSkillsDelay: 500,
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
    const { title, subSkills, index, count } = this.props;

    return (
      <>
        <H3 index={index} text={title} count={count} />

        {subSkills !== null &&
          <Transition
            in={true}
            timeout={animTimeout}
            appear
            in
          >
            {state =>
              <ul
                className='skill-ul'
                style={{
                  maxHeight: state === 'entered' ? 200 : 0 + 'px',
                  transition: `max-height ${animTimeout}ms`,
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
        transform: `translateX(${state === 'entered' ? 0 : -200}px)`,
        opacity: state === 'entered' ? 1 : 0,
        transition: `transform ${animTimeout}ms, opacity ${animTimeout}ms`,
        transitionDelay:
          (props.count + props.index) * DEF.skillsInDiff +
          DEF.subSkillsDelay + 500 + 'ms',
      }}
    >{props.text}</li>
  }
</Transition >
