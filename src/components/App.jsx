import React, { Component, createRef } from 'react';
import { Router, Route, Link, Switch, } from 'react-router-dom';
import History from 'history/createBrowserHistory';

//? components
import SideMenu from './side-menu/SideMenu';
import Title from './Title';
import Container from './ContentContainer';

//? pages
import Home from './pages/Home';
import ProjectPresentation from './pages/ProjectPresentation';

import { hot } from 'react-hot-loader';

import '../scss/main.scss';

const history = History();

import Loader from './LoadIndicator';

//* example template
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
      location: { pathname: props.startLocation },
      doAnim: true,

      bioHasTyped: false,
    }
    history.listen((location) => {
      this.setState({ location: location, doAnim: false }, () => {
        this.setState({ doAnim: true });
      });
    });

    this.openMenu = this.openMenu.bind(this);

    this.routes = () => [
      {
        to: '/', text: 'Home',
        component:
          <Home
            onMenuOpen={this.openMenu}
            onBioTyped={() => this.setState({ bioHasTyped: true })}
            typeBio={!this.state.bioHasTyped}
          />
      },
      {
        to: '/kpi-labs', text: 'Kpi Labs',
        component:
          <ProjectPresentation jsonDataPath='../../kpi-labs.json' />
      },
      // {
      //   to: '/loader-demo', text: 'Loader demo',
      //   component:
      //     <ProjectPresentation><Loader /></ProjectPresentation>
      // },
      {
        text: 'Gamedev',
        group: [
          {
            to: '/hue-game', text: 'Hue game',
            component:
              <ProjectPresentation jsonDataPath='../../hue-game.json' />
          },
          {
            to: '/cube-switch', text: 'Cube switch',
            component:
              <ProjectPresentation jsonDataPath='../../cube-switch.json' />
          },
        ]
      },
      {
        to: '/dev-helper', text: 'dev-helper',
        component:
          <ProjectPresentation jsonDataPath='../../dev-helper.json' />
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
    const routes = this.routes();

    return (
      <Router history={history}>
        <div className='root'>

          {/* -----MAIN BODY----- */}
          <Title
            animTrigger={this.state.doAnim}
            text={routes.find(v =>
              v.group ?
                v.group.find(_v => _v.to === this.state.location.pathname) :
                v.to === this.state.location.pathname).text}
            onOpenMenu={this.openMenu}
          />
          <div className='content-container'
            ref={e => { this.rootEl = e; }}
          >
            <div className='top-shadow' />
            <Container location={this.state.location} routes={routes} />
          </div>

          <SideMenu
            ref={e => { this.sm = e; }}
            toBlur={null}
          >{routes}</SideMenu>

        </div>
      </Router>
    )
  }
}

export default hot(module)(App);
