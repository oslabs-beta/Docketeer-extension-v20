// REACT TESTING LIBRARY
import { RenderResult, render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

// REDUX PROVIDER AND STORE
import { Provider } from 'react-redux';
import store from '../src/store';

// REACT ROUTER
import { HashRouter } from 'react-router-dom';

// IMPORT TESTED COMPONENT
import SharedLayout from '../src/components/SharedLayout/SharedLayout'


let sharedLayout: RenderResult;

describe('SharedLayout should display all navbar links', () => {
  beforeEach( () => {
  sharedLayout = render(
    <Provider store={store}>
      <HashRouter>
        <SharedLayout />
      </HashRouter>
    </Provider>
  );
});

it('CONTAINER', () => {
    // console.log('my render component: ', sharedLayout);
    expect(screen.getByRole('link', { name: /containers/i })).toBeVisible();
  });

  it('NETWORKS', () => {
    expect(screen.getByRole('link', { name: /networks/i })).toBeVisible();
  });

  it('IMAGES', () => {
    expect(screen.getByRole('link', { name: /images/i })).toBeVisible();
  });

  it('HAMBURGER', () => {
    expect(screen.getByRole('menubar')).toBeVisible();
  });


});

describe('Hamburger menu should have remaining routes', async () => {
  beforeEach(() => {
    sharedLayout = render(
      <Provider store={store}>
        <HashRouter>
          <SharedLayout />
        </HashRouter>
      </Provider>
    );
  });
  
  it('Hamburger menu is still visible', () => { 
    expect(screen.getByRole('menubar')).toBeVisible();
    })

  it('Sidebar is initially not rendered', () => {
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('Sidebar is rendered after clicking menubar', () => {
    fireEvent.click(screen.getByRole('menubar'));
    // screen.debug();

    expect(screen.queryByTestId('sidebar')).toBeInTheDocument();
  });
})

describe('After clicking on Hamburger menu, Sidebar should display remaining links', () => { 
    
  beforeEach(() => { 
    sharedLayout = render(
      <Provider store={store}>
        <HashRouter>
          <SharedLayout />
        </HashRouter>
      </Provider>
    );

      fireEvent.click(screen.getByRole('menubar'));
  })
  
  it('Sidebar is rendering', () => { 
    expect(screen.queryByTestId('sidebar')).toBeInTheDocument()
  })
  
  it('CONTAINER METRICS', () => { 
    expect(screen.getByRole('link', {name: /container metrics/i})).toBeVisible()
   })

  it('SNAPSHOTS', () => { 
    expect(screen.getByRole('link', {name: /SNAPSHOTS/i})).toBeVisible()
   })

  it('KUBERNETES METRICS', () => { 
    expect(screen.getByRole('link', {name: /KUBERNETES metrics/i})).toBeVisible()
   })

  it('VOLUMES', () => { 
    expect(screen.getByRole('link', {name: /VOLUMES/i})).toBeVisible()
   })

  it('PROCESS LOGS', () => { 
    expect(screen.getByRole('link', {name: /PROCESS LOGS/i})).toBeVisible()
   })

  it('CONFIGURATIONS', () => { 
    expect(screen.getByRole('link', {name: /CONFIGURATIONS/i})).toBeVisible()
   })

  it('PRUNE', () => { 
    expect(screen.getByText('PRUNE')).toBeVisible()
   })


})
