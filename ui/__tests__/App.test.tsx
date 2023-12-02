import { render, screen } from '@testing-library/react'

// IMPORT THE COMPONENT TO BE TESTED
import App from '../src/App.tsx'
import React from 'react'

it('Should have Routes', () => { 
  render(<App />)
  const message = screen.queryByText('Containers');
  expect(message).toBeVisible()
 })