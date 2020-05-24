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
    uploadTrack: async (manifest) => {
      action("manifest")(manifest);
      try {
        // FIXME
        //
        let endpoint = "http://localhost:3000/dev";

        let rsp = await fetch(`${endpoint}/api/transactions`, {
          method: "PUT",
        })
          .then(r => r.json());

        action("transaction")(rsp);

        let { upload } = rsp.data;

        await fetch(upload.url, {
          method: upload.httpMethod,
          body: JSON.stringify(manifest),
        });

        // FIXME - Bad
        (async function check() {
          let transactionStatus = await fetch(`${endpoint}/api/transactions/${rsp.data.transactionId}`)
            .then(r => r.json());

          if(transactionStatus.data.item.status !== 'DONE') {
            setTimeout(check, 2000);
          }
        })();
      } catch(e) {
        console.error(e);
        throw e;
      }
    }
  };

  return (
    <AppContext.Provider value={value}>
      <App />
    </AppContext.Provider>
  );
};
