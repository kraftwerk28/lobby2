import React from 'react'
import { Route } from 'react-router'
import Typed from 'typed.js'

class NotFoundPage extends React.Component {
  typed = null
  
  componentDidMount() {
    this.typed = new Typed('#type', {
      strings: [
        '=====>',
        'Swipe right'
      ],
      startDelay: 1000,
      loop: true,
      typeSpeed: 60,
      showCursor: false,
      backDelay: 1000,
    })
  }
  
  render() {
    
    return (
      <Route>
        <div className='glitch not-found' data-text='404'>
          404
        <div className='swipe-right'><span id='type'>
        </span></div>
        </div>
      </Route>
    )
  }

}

export default NotFoundPage
