import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, button, text } from "@storybook/addon-knobs";

import { App } from './App';

import { AppContext } from './AppContext';

export default {
  title: App.name,
  decorators: [withKnobs]
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
  const endpoint = text("endpoint", "http://localhost:3000/dev");

  button("process inbox", async () => {
    action('processing-inbox')("started");

    try {
      const rsp = await fetch(`${endpoint}/restricted/debug/process-inbox`)

      const result = await rsp.json();

      action('processinig-inbox')("finished");
      action('processinig-inbox')({
        result,
      });
    } catch(e) {
    action('processinig-inbox')("failed");
    }
  });

  let value = {
    user: {
      name: "Test User",
    },
    uploadTrack: async (manifest) => {
      action("manifest")(manifest);
      try {
        // FIXME
        //

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
