import React from 'react';
import {
  StaticRouter,
} from "react-router-dom"


import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { App, DefaultApp } from './App';

describe('App', () => {
  it('renders', () => {
    const { getByTestId } = render(
      <StaticRouter>
        <App />
      </StaticRouter>
    );
  });
});

describe('DefaultApp', () => {
  it('renders', () => {
    const { getByTestId } = render(<DefaultApp />);
  });
});
