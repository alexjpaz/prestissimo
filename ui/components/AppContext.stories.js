import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, button, text } from "@storybook/addon-knobs";

import { PrestissimoApi } from '../helpers/PrestissimoApi';
import { DefaultAppContextProvider } from './AppContext';

export default {
  title: "AppContext",
  decorators: [withKnobs]
};

export const withLocalServer = () => {
  return (
    <DefaultAppContextProvider>
      <h1>AppContext</h1>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </DefaultAppContextProvider>
  );
};


