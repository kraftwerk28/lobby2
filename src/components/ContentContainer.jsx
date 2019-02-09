import React, { Component } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Router, Route, Link, Switch, } from 'react-router-dom'
import NotFoundPage from './pages/404';

export default class Container extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { location, routes } = this.props

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
            {routes.map((p, i) =>
              p.group ? p.group.map((v, i_) => (
                <Route
                  exact
                  path={v.to}
                  key={routes.length + i_}
                  render={() => (
                    <div className='tr-wrapper'>
                      {v.component}
                    </div>
                  )}
                />
              )) : [<Route
                exact
                path={p.to}
                key={i}
                render={() => (
                  <div className='tr-wrapper'>
                    {p.component}
                  </div>
                )}
              />]
            ).reduce((r, c) => [...r, ...c], [])}
            <NotFoundPage />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    )
  }
}
