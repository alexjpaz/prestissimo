import React from 'react';
import { action } from '@storybook/addon-actions';

import { AudioFileInput } from './AudioFileInput';

export default {
  title: AudioFileInput.name,
};

export const withDefault = () => (
  <AudioFileInput />
);
