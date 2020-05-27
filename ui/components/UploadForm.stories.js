import React from 'react';
import { action } from '@storybook/addon-actions';

import { UploadForm } from './UploadForm';

export default {
  title: UploadForm.name,
};

export const withDefault = () => (
  <UploadForm onUpload={(e) => {
    e.items[0].data = e.items[0].data.slice(0,30) + "__TRUNCATED__";
    action('onUpload')(e);
  }}/>
);
