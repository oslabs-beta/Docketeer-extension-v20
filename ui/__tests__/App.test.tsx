// REACT TESTING LIBRARY
import { RenderResult, render, screen } from '@testing-library/react';

// REDUX PROVIDER AND STORE
import { Provider } from 'react-redux';
import store from '../src/store';

// REACT ROUTER
import { HashRouter } from 'react-router-dom';

// IMPORT THE COMPONENT TO BE TESTED
import App from '../src/App';
import SharedLayout from '../src/components/SharedLayout/SharedLayout';
import React from 'react';

describe('Simple App rendering test', () => {

  let app: RenderResult;

  // RENDER THE APP BEFORE ALL THE TESTS
  beforeEach(async () => { 
    app = await render(
      <Provider store={store}>
        <HashRouter>
          <App />
        </HashRouter>
      </Provider>
    );
   })

  describe('Should render the Navbar with Routes', () => {

    it('CONTAINER link is visible', () => { 
      expect(screen.getByRole('link', {name: /containers/i})).toBeVisible();
    })
    
    it('NETWORKS link is visible', () => {
      expect(screen.getByRole('link', { name: /networks/i })).toBeVisible();
    });
    
    it('IMAGES link is visible', () => {
      expect(screen.getByRole('link', { name: /images/i })).toBeVisible();
    });
    
    it('HAMBURGER icon is visible', () => {
      expect(screen.getByRole('menubar')).toBeVisible();
    });
    
  });

  describe('Should render the Containers Component', () => { 

    it('Containers Component is visible when rendering the App', () => { 
      expect(screen.getByTestId('containersComponent')).toBeVisible()
     })

   })
});
