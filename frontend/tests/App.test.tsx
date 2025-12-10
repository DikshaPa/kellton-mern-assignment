import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

test('renders MERN Admin Dashboard', () => {
  render(<App />);
  const linkElement = screen.getByText(/MERN Admin Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});

test('shows project setup complete message', () => {
  render(<App />);
  const setupMessage = screen.getByText(/Step 1: Project Setup Complete!/i);
  expect(setupMessage).toBeInTheDocument();
});