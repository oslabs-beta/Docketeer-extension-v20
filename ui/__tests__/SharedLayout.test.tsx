import { render, screen } from '@testing-library/react'

import { Provider } from 'react-redux';
import store from '../src/store';

import { HashRouter } from 'react-router-dom';


// IMPORT TESTED COMPONENT
import SharedLayout from '../src/components/SharedLayout/SharedLayout'
import React from 'react'


it('SharedLayout should render', () => { 
  render(
    <Provider store={store}>
      <HashRouter>
        <SharedLayout />
      </HashRouter>
    </Provider>
  );
})
 
 it('Should have Navbar Tabs', () => { 
   render(
     <Provider store={store}>
       <HashRouter> 
        <SharedLayout/>
       </HashRouter>
    </Provider>)
   const message = screen.getByText(/IMAGES/i);
   expect(message).toBeVisible();
  })