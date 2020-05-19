import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { UploadForm } from './UploadForm';

it('renders', () => {
  const { getByTestId } = render(<UploadForm />);
  expect(getByTestId('UploadForm')).toBeVisible();
  expect(getByTestId('audio')).toBeVisible();
});
