import { render, screen } from '@testing-library/react'

import { Provider } from 'react-redux';
import store from '../src/store';

import { HashRouter } from 'react-router-dom';


// IMPORT THE COMPONENT TO BE TESTED
import App from '../src/App'
import React from 'react'

it('Should have Routes', () => { 
  render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  );
  const message = screen.getByText(/NETWORKS/i);
  expect(message).toBeVisible()
 })