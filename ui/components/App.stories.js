import React from 'react';
import { action } from '@storybook/addon-actions';

import { App } from './App';

import { AppContext } from './AppContext';

export default {
  title: 'App',
};

export const withMockServer = () => {
  let value = {
    user: {
      name: "Test User",
    },
    uploadTrack: action('uploadTrack')
  };

  return (
    <AppContext.Provider value={value}>
      <App />
    </AppContext.Provider>
  );
};

export const withLocalServer = () => {
  let value = {
    user: {
      name: "Test User",
    },
    uploadTrack: async () => {
      const json = await fetch("http://localhost:3000/dev/api/status")
        .then(r => r.json());

      action("status")(json);
    }
  };

  return (
    <AppContext.Provider value={value}>
      <App />
    </AppContext.Provider>
  );
};
