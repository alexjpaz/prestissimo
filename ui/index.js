import React from 'react';
import ReactDOM from 'react-dom';

const { logger } = require('./logger');

import { App } from './components/App';

const title = 'React with Webpack and Babel';

let loader = document.querySelector('#loader');

if(loader) {
  loader.remove();
}

let root = document.querySelector('#app');

ReactDOM.render(
  <App />,
  root
);

logger.info("Started Prestissimo");

