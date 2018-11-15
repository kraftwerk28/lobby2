import React from 'react';
import Button from './Button';

export default (props) => (
  <Button
    className='menu-btn'
    background='black'
    icon='menu'
    // transparent
    rounded
    rippleColor='#aaa'
    rippleOpacity={0.5}
    onClick={() => { props.sideMenu.expand(true); }}
  />
);
