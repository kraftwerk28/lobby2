import React, { Component, createRef } from 'react';
import { Router } from 'react-router-dom';
import History from 'history/createBrowserHistory';

//? components
import SideMenu from './side-menu/SideMenu';
import Title from './Title';
import Container from './ContentContainer';

//? pages
import Home from './pages/Home';
import ProjPres from './pages/ProjectPresentation';

import { hot } from 'react-hot-loader';

import '../scss/main.scss';

const history = History();

import Loader from './LoadIndicator';
import _fetch from '../../crud/src/jsonfetch';

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
    this.routes = () => [];
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

    _fetch('schema').then(_ => _.json()).then(data => {
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
        ...data.map(entry => {
          if (entry.group) {
            entry.group =
              entry.group
                .map(sub => ({ ...sub, component: <ProjPres data={sub} /> }));
            return entry;
          } else {
            return { ...entry, component: <ProjPres data={entry} /> };
          }
        })
      ];
      this.forceUpdate();
    });

    /*
    this.routes =
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
            <ProjPres jsonDataPath='../../kpi-labs.json' />
        },
        {
          text: 'Gamedev',
          group: [
            {
              to: '/hue-game', text: 'Hue game',
              component:
                <ProjPres jsonDataPath='../../hue-game.json' />
            },
            {
              to: '/cube-switch', text: 'Cube switch',
              component:
                <ProjPres jsonDataPath='../../cube-switch.json' />
            },
          ]
        },
        {
          to: '/dev-helper', text: 'dev-helper',
          component:
            <ProjPres jsonDataPath='../../dev-helper.json' />
        },
      ];
      */

  }

  componentDidMount() {
    // this.forceUpdate();
  }

  openMenu = () => {
    this.sm.expand(true);
  }

  render = () => {
    const routes = this.routes();

    return (
      <Router history={history}>
        {routes.length ? <div className='root'>

          {/* -----MAIN BODY----- */}
          <Title
            animTrigger={this.state.doAnim}
            text={routes
              .map(r => r.group ? r.group : [r])
              .reduce((r, c) => [...r, ...c])
              .find(v =>
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

        </div> : <Loader />}
      </Router>
    )
  }
}

export default hot(module)(App);
