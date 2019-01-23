import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';

import App from './components/App';
import TokenRequest from './components/TokenRequest';

const htmlel = document.querySelector('#root');

const renderApp = () => {
  ReactDOM.unmountComponentAtNode(htmlel);
  ReactDOM.render(<App />, htmlel);
};

ReactDOM.render(<TokenRequest onPwdEnter={renderApp} />, htmlel);

// (async () => {

//   ReactDOM.render(<App />, document.querySelector('#root'));
// })();

