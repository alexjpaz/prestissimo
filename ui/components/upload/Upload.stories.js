import React from 'react';
import { action } from '@storybook/addon-actions';

import { MemoryRouter } from "react-router-dom"

import { Upload } from './Upload';
import { AppContext } from '../AppContext';

export default {
  title: 'Upload',
};

export const withDefault = () => {
  const aSecond = (t) => new Promise(r => setTimeout(r, t));

  const [ state, setState ] = React.useState({
    uploadTrack: async (e) => {
      setState({
        ...state,
        progress: "0",
        uploadThing: {
          item: {
            status: "UPLOADING",
          },
          userId: "FAKE",
          transactionId: "FAKE",
        },
      });

      await aSecond(1000);

      setState({
        ...state,
        progress: "25",
        uploadThing: {
          item: {
            status: "CREATED",
          },
          userId: "FAKE",
          transactionId: "FAKE",
        },
      });

      await aSecond(1000);

      setState({
        ...state,
        progress: "75",
        uploadThing: {
          item: {
            status: "PROCESSING",
          },
          userId: "FAKE",
          transactionId: "FAKE",
        },
      });


      await aSecond(1000);

      setState({
        ...state,
        progress: "100",
        uploadThing: {
          item: {
            status: "SUCCESSS",
          },
          results: {
            targets: [
              {
                format: "mp3",
                key: "conversions/users/FAKE/transactions/FAKE/mp3",
              }
            ]
          },
          userId: "FAKE",
          transactionId: "FAKE",
        },
      });
    }
  });

  return (
    <MemoryRouter>
      <AppContext.Provider value={state}>
        <Upload />
      </AppContext.Provider>
    </MemoryRouter>
  );
};
