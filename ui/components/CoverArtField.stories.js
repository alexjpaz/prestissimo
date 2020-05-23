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
  </div>
);

export const withLongTtitle = () => (
  <div style={{width:'512px', padding: '10px'}}>
    <CoverArtField value="Lorem Ipsum dolor sit amet" />
  </div>
);

export const withEmoji = () => (
  <div style={{width:'512px', padding: '10px'}}>
    <CoverArtField value="😎" />
  </div>
);

export const withFont = () => (
  <div style={{width:'512px', padding: '10px'}}>
    <CoverArtField value={String.fromCharCode("0x2665")} />
  </div>
);
