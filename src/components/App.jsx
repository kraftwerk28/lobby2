import React, { Component, createRef } from 'react';
import '../scss/main.scss';

import SideMenu from './side-menu/SideMenu';
import Title from './Title';
import Container from './ContentContainer';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Router, Route, Link, Switch, } from 'react-router-dom';
import History from 'history/createBrowserHistory';

import Home from './pages/Home';
import Test from './pages/Test';

const history = History();

const routes = {
  '/': ['Home', <Home />],
  '/main': ['Main', <Test />],
  '/main2': ['Main2', <Home />],
};


export default class App extends Component {
  constructor(props) {
    super(props);
    this.rootEl = createRef();
    this.sm = createRef();
    this.state = {
      trx: 0,
      canNext: false,
      location: { pathname: '/' },
      doAnim: true,
    }
    history.listen((location) => {
      this.setState({ location: location, doAnim: false }, () => {
        this.setState({ doAnim: true });
      });
    });
  }

  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    return (
      <Router history={history}>
        <div className='root'>

          {/* -----MAIN BODY----- */}
          <Title
            animTrigger={this.state.doAnim}
            text={routes[this.state.location.pathname][0]}
            sideMenu={this.sm}
          />
          <div className='content-container'
            ref={e => { this.rootEl = e; }}
          >
            <Container location={this.state.location} routes={routes} />
          </div>

          <SideMenu
            ref={e => { this.sm = e; }}
            toBlur={null}
          >
            <Link to='/'>Home</Link>
            <Link to='/main'>Main</Link>
            <Link to='/main2'>Main2</Link>
          </SideMenu>

        </div>
      </Router>
    )
  }
}
