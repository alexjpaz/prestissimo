import React from 'react';
import { action } from '@storybook/addon-actions';

import { UploadForm } from './UploadForm';

export default {
  title: UploadForm.name,
};

export const withDefault = () => (
  <UploadForm />
);
