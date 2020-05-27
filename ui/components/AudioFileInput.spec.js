import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

const fs = require('fs').promises;

import { AudioFileInput }  from './AudioFileInput';

test('renders', () => {
  const { getByTestId } = render(<AudioFileInput />);
  const fileElement = getByTestId(/file/i);
  expect(fileElement).toBeInTheDocument();
});

test('read file', async () => {
  const onFileChange = jest.fn();
  const { getByTestId, findByTestId } = render(<AudioFileInput onFileChange={onFileChange} />);
  const fileElement = getByTestId(/file/i);
  expect(fileElement).toBeInTheDocument();

  const fakeContent = Buffer.from("FAKE_BINARY_DATA");

  const fakeFile = new File([fakeContent], "simplescale.wav", {
    type: "audio/wav",
  });

  fireEvent.change(fileElement, {
    target: {
      files: [fakeFile]
    }
  });

  await findByTestId(/file-name/);

  expect(onFileChange).toHaveBeenCalledWith({
    file: fakeFile
  });
});


