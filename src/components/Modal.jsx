import React, { Component } from 'react';
import Button from './Button';

class Modal extends Component {
  constructor(props) {
    super(props);
  }

  closeModal() {

  }

  render() {
    return (
      <div
        className='modal-root'
      >
        <div className='modal-container'>
          <div className='modal-header'>
            <div />
            <div>
              <h1>{this.props.headerText}</h1>
            </div>
            <div>
              <Button
                rounded
                transparent
                icon='close'
                onClick={this.closeModal}
              />
            </div>
          </div>

          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Modal;
