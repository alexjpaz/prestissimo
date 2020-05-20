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
  const onClose = jest.fn();
  const { getByTestId, findByTestId } = render(<AudioFileInput onClose={onClose} />);
  const fileElement = getByTestId(/file/i);
  expect(fileElement).toBeInTheDocument();

  const fakeContent = await fs.readFile('./test/examples/simplescale.wav');
  //const fakeContent = Buffer.from("FAKE_BINARY_DATA");

  const fakeFile = new File([fakeContent], "simplescale.wav", {
    type: "audio/wav",
  });

  fireEvent.change(fileElement, {
    target: {
      files: [fakeFile]
    }
  });

  await findByTestId(/file-loaded/);

  expect(onClose).toHaveBeenCalled();

  const base64 = fakeContent.toString('base64');

  expect(onClose.mock.calls[0][0]).toContain(`data:audio/wav;base64,${base64}`);
});


