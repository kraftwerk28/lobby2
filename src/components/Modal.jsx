import React, { Component } from 'react';
import Button from './Button';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    }
  }

  closeModal = () => {
    this.setState({ opened: false });
  };

  openModal = () => {
    this.setState({ opened: true });
  };

  render = () => (
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
  );
}

export default Modal;
