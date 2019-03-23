import React, {
  Component,
  createRef,
  useRef,
  useEffect,
  useState,
} from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import Helmet from 'react-helmet'

//? components
import SideMenu from './side-menu/SideMenu'
import Title from './Title'
import Container from './ContentContainer'

//? pages
import Home from './pages/Home'
import ProjPres from './pages/ProjectPresentation'

import { hot } from 'react-hot-loader'

import '../sass/main'

const history = createBrowserHistory()

import Loader from './LoadIndicator'
import _fetch from '../../crud/src/jsonfetch'


const App = (props) => {
  const rootEl = useRef()
  const sm = useRef()
  const topColorSeq = [
    '#000000',
    '#00ff00',
  ]
  let topColorIndex = 0

  const [, fUpdate] = useState()
  const [routes, setRoutes] = useState([])
  const [canNext, setCannNext] = useState(false)
  const [location, setLocation] = useState({ pathname: props.startLocation })
  const [doAnim, setDoAnim] = useState(true)
  const [bioHasTyped, setBioHasTyped] =
    useState((process.env.NODE_ENV === 'development'))
  const [topColor, setTopColor] =
    useState(topColorSeq[topColorIndex])

  const openMenu = () => {
    console.log(sm)
    sm.current.expand(true)
  }

  const getTextFromRoute = (routes) => {
    const res = routes
      .map(r => r.group ? r.group : [r])
      .reduce((r, c) => [...r, ...c])
      .find(v =>
        v.to === location.pathname)
    return (typeof res === 'undefined') ? '404 not found' : res.text
  }

  useEffect(() => {
    history.listen((location) => {
      setLocation(location)
      setDoAnim(false)
      setDoAnim(true)
      rootEl.current.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    })

    _fetch('schema').then(_ => _.json()).then(data => {
      setRoutes([
        {
          to: '/', text: 'Home',
          component:
            <Home
              onMenuOpen={openMenu}
              onBioTyped={() => setBioHasTyped(true)}
              typeBio={!bioHasTyped}
            />
        },
        ...data.map(entry => {
          if (entry.group) {
            entry.group =
              entry.group
                .map(sub => ({ ...sub, component: <ProjPres data={sub} /> }))
            return entry
          } else {
            return { ...entry, component: <ProjPres data={entry} /> }
          }
        })
      ])
    })
    // setInterval(() => {
    //   this.topColorIndex = (this.topColorIndex + 1) % this.topColorSeq.length
    //   this.setState({
    //     topColor: this.topColorSeq[this.topColorIndex]
    //   })
    //   console.log(this.top)
    // }, 5000)
  }, [])

  return (
    <>
      <Helmet>
        <meta name='theme-color' content={topColor}></meta>
      </Helmet>

      <Router history={history}>
        {routes.length ? <div className='root'>

          {/* -----MAIN BODY----- */}
          <Title
            animTrigger={doAnim}
            text={getTextFromRoute(routes)}
            onOpenMenu={openMenu}
          />
          <div className='content-container'
            ref={rootEl}
          >
            <div className='top-shadow' />
            <Container location={location} routes={routes} />
          </div>

          <SideMenu
            ref={sm}
            toBlur={null}
          >{routes}</SideMenu>

        </div> : <Loader />}
      </Router>
    </>
  )
}

// class App extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       canNext: false,
//       location: { pathname: props.startLocation },
//       doAnim: true,
//       bioHasTyped: (process.env.NODE_ENV === 'development'),
//       topColor: this.topColorSeq[this.topColorIndex]
//     }



//   }

//   componentDidMount() {
//     _fetch('schema').then(_ => _.json()).then(data => {
//       this.routes = () => [
//         {
//           to: '/', text: 'Home',
//           component:
//             <Home
//               onMenuOpen={this.openMenu}
//               onBioTyped={() => this.setState({ bioHasTyped: true })}
//               typeBio={!this.state.bioHasTyped}
//             />
//         },
//         ...data.map(entry => {
//           if (entry.group) {
//             entry.group =
//               entry.group
//                 .map(sub => ({ ...sub, component: <ProjPres data={sub} /> }))
//             return entry
//           } else {
//             return { ...entry, component: <ProjPres data={entry} /> }
//           }
//         })
//       ]
//       this.forceUpdate()
//     })
//     setInterval(() => {
//       this.topColorIndex = (this.topColorIndex + 1) % this.topColorSeq.length
//       this.setState({
//         topColor: this.topColorSeq[this.topColorIndex]
//       })
//       console.log(this.top)
//     }, 5000)
//   }

//   openMenu = () => {
//     this.sm.expand(true)
//   }

//   getTextFromRoute = (routes) => {
//     const res = routes
//       .map(r => r.group ? r.group : [r])
//       .reduce((r, c) => [...r, ...c])
//       .find(v =>
//         v.to === this.state.location.pathname)
//     return (typeof res === 'undefined') ? '404 not found' : res.text
//   }

//   render = () => {
//     const routes = this.routes()

//     return (
//       <>
//         <Helmet
//         >
//           <meta name='theme-color' content={this.state.topColor}></meta>
//         </Helmet>
//         <Router history={history}>
//           {routes.length ? <div className='root'>

//             {/* -----MAIN BODY----- */}
//             <Title
//               animTrigger={this.state.doAnim}
//               text={this.getTextFromRoute(routes)}
//               onOpenMenu={this.openMenu}
//             />
//             <div className='content-container'
//               ref={e => { this.rootEl = e }}
//             >
//               <div className='top-shadow' />
//               <Container location={this.state.location} routes={routes} />
//             </div>

//             <SideMenu
//               ref={e => { this.sm = e }}
//               toBlur={null}
//             >{routes}</SideMenu>

//           </div> : <Loader />}
//         </Router>
//       </>
//     )
//   }
// }


export default App
