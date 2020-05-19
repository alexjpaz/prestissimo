import React from 'react';
import ReactDOM from 'react-dom';

const { logger } = require('./logger');

const title = 'React with Webpack and Babel';

let loader = document.querySelector('#loader');

if(loader) {
  loader.remove();
}

let root = document.querySelector('#app');

function App() {
  return (
    <div data-test-id='App-root'>
    </div>
  );
}

ReactDOM.render(
  <App />,
  root
);

logger.info("Started Prestissimo");

