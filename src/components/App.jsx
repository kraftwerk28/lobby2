import React, { Component, createRef } from 'react';
import '../scss/main.scss';

import SideMenu from './side-menu/SideMenu';
import Title from './Title';
import Container from './ContentContainer';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Router, Route, Link, Switch, } from 'react-router-dom';
import History from 'history/createBrowserHistory';

import Home from './pages/Home';
import ProjectPresentation from './pages/ProjectPresentation';
import Test from './pages/Test';

import {hot} from 'react-hot-loader';

const history = History();

// const routes = [
//   { to: '/', text: 'Home', component: <Home /> },
// { to: '/main', text: 'Main', component: <Test /> },
// {
//   text: 'Hello',
//   group: [
//     { to: '/main3', text: 'Hi there1', component: <Test /> },
//     { to: '/main3', text: 'Hi there1', component: <Test /> },
//     { to: '/main3', text: 'Hi there1', component: <Test /> },
//     { to: '/main3', text: 'Hi there1', component: <Test /> },
//   ]
// },
// { to: '/main2', text: 'Main2', component: <Home /> },
// ];

// const flattenRoutes = () => {
//   const getFlatten = r => r.group ? r.group.map(v => getFlatten(v)) : [r];
//   return routes.map(v => getFlatten(v))//.reduce((res, cur) => [...res, ...cur], []);
// };

class App extends Component {
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

    this.openMenu = this.openMenu.bind(this);

    this.routes = [
      { to: '/', text: 'Home', component: <Home onMenuOpen={this.openMenu} /> },
      {
        to: '/kpi-labs', text: 'Kpi Labs',
        component:
          <ProjectPresentation jsonDataPath='../../data/kpi-labs.json' />
      },
    ];
  }

  componentDidMount() {
    // this.forceUpdate();
  }

  openMenu() {
    this.sm.expand(true);
  }

  render() {
    const routes = this.routes;

    return (
      <Router history={history}>
        <div className='root'>

          {/* -----MAIN BODY----- */}
          <Title
            animTrigger={this.state.doAnim}
            text={routes.find(v =>
              v.group ?
                v.group.find(_v => _v.to = this.state.location.pathname) :
                v.to === this.state.location.pathname).text}
            onOpenMenu={this.openMenu}
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
            {routes}
            {/* <Link to='/'>Home</Link>
            <Link to='/main'>Main</Link>
            <Link to='/main2'>Main2</Link>
            <React.Fragment group title='Hello'>
              <Link to='/main3'>Hello1</Link>
              <Link to='/main4'>Hello2</Link>
            </React.Fragment> */}
          </SideMenu>

        </div>
      </Router>
    )
  }
}

export default hot(module)(App);
