import React from 'react';

const DEF = {
  divCount: 3,
  pulseTime: 2000,
  allDelay: 1000,
};

const Loader = () => <div className='pulse-loader' >
  <div>
    {Array.from(new Array(DEF.divCount).keys()).map((_, i) => <div
      key={i}
      style={{
        animationDelay: DEF.allDelay + i * (DEF.pulseTime / DEF.divCount) + 'ms',
        animationDuration: DEF.pulseTime + 'ms',
      }}
    />)}
  </div>
</div>

export default Loader;
