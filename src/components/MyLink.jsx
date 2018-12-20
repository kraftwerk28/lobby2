import React from 'react';
import Ripple from './Ripple';

const Mylink = props => {
  const { href, ...rest } = props;
  return (
    <a href={props.href} target='_blank' {...rest}>
      {props.children}
      <Ripple inner />
    </a>
  )
}

export default Mylink;
