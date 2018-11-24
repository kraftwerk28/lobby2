import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Router, Route, Link, Switch, } from 'react-router-dom';

export default class Container extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { location, routes } = this.props;

    return (
      <TransitionGroup>
        <CSSTransition
          classNames={{
            appear: 'article-enter',
            appearActive: 'article-enter-active',
            enter: 'article-enter',
            enterActive: 'article-enter-active',
            exit: 'article-exit',
            exitActive: 'article-exit-active',
          }}
          timeout={1000}
          key={location.key}
          appear
          unmountOnExit
        >
          <Switch location={location}>
            {Object.keys(routes).map((p, i) => (
              <Route
                exact
                path={p}
                key={i}
                render={() => (
                  <div className='tr-wrapper'>
                    {routes[p][1]}
                  </div>
                )} />
            ))}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    )
  }
}
