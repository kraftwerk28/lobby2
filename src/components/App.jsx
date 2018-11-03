import React, { Component } from 'react';
import '../scss/main.scss';
import Button from './Button.jsx';
import SideMenu from './side-menu/SideMenu';
import Transition from 'react-transition-group';
import Swipeable from 'react-swipeable';


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
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <SideMenu ref={e => { this.sm = e; }} toBlur={/*this.rootEl*/null} />


        <div>
          <Button background='green'
            rippleColor='black'
            rippleOpacity={0.5}
            transparent
            rippleStyle={{ background: 'purple' }}
            onClick={() => { this.sm.expand(true) }}
          >hello</Button>
        </div>
      </div>
    )
  }
}

export default App

const style = {
  background: 'red'
}
