import React from 'react';
import { action } from '@storybook/addon-actions';

import { CoverArtField } from './CoverArtField';

export default {
  title: CoverArtField.name,
};

export const withOneWord = () => (
  <div style={{width:'512px', padding: '10px'}}>
    <CoverArtField value="Lorem" />
  </div>
);

export const withTwoWords = () => (
  <div style={{width:'512px', padding: '10px'}}>
    <CoverArtField value="Lorem Ipsum" />
    <CoverArtField value="Lorem Ipsum 12312j je 2oi3j12 j3" />
  </div>
);

export const withLongTtitle = () => (
  <div style={{width:'512px', padding: '10px'}}>
    <CoverArtField value="Lorem Ipsum dolor sit amet" />
  </div>
);
