import React, { Component } from 'react';
import '../scss/main.scss';
import Button from './Button.jsx';
import SideMenu from './side-menu/SideMenu';
import Transition from 'react-transition-group';
import Swipeable from 'react-swipeable';
import Collapsible from 'react-collapsible';
import Home from './pages/Home';

class App extends Component {
  constructor(props) {
    super(props);
    this.rootEl = React.createRef();
    this.state = {
      trx: 0,
    }
  }

  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}>

          <div
            ref={e => { this.rootEl = e; }}
          >

            <Home />

          </div>
        </div>

        <SideMenu ref={e => { this.sm = e; }} toBlur={null} />

        <Button
          className='menu-btn'
          icon='menu'
          transparent
          rounded
          rippleColor='#aaa'
          rippleOpacity={0.5}
          onClick={() => { this.sm.expand(true) }}
        >hello</Button>

      </div>
    )
  }
}

export default App

const style = {
  background: 'red'
}
