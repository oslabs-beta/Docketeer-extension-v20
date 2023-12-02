import React from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Metrics from './components/Metrics/Metrics';
import Snapshots from './components/Snapshots/Snapshots';
import Images from './components/Images/Images';
import Containers from './components/Containers/Containers';
import VolumeHistory from './components/VolumeHistory/VolumeHistory'; // need to fix types
import ProcessLogs from './components/ProcessLogs/ProcessLogs';
import SharedLayout from './components/SharedLayout/SharedLayout';
import Network from './components/Network/Network';
import K8Metrics from './components/K8Metrics/K8Metrics'
import Configuration from './containers/Configuration';

// TESTING NEW ROUTER SETUP:

const router = createBrowserRouter([
  {
    path: '/',
    element: <SharedLayout />,
    children: [
      {
        path: '/',
        element: <Containers />,
      },
      {
        path: '/volume',
        element: <VolumeHistory />,
      },
      {
        path: '/metrics',
        element: <Metrics />,
      },
      {
        path: '/snapshots',
        element: <Snapshots />,
      },
      {
        path: '/K8Metrics',
        element: <K8Metrics />,
      },
      {
        path: '/logs',
        element: <ProcessLogs />,
      },
      {
        path: '/images',
        element: <Images />,
      },
      {
        path: '/network',
        element: <Network />,
      },
      {
        path: '/configuration',
        element: <Configuration />,
      },
    ],
  },
]);

/* ************************** */


const App = (): React.JSX.Element => {
  return (
    // <>
    // <RouterProvider router={router}/>
    // </>
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route path="/" element={<Containers />} />
        <Route path="/volume" element={<VolumeHistory />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/snapshots" element={<Snapshots />} />
        <Route path="/K8Metrics" element={<K8Metrics />} />
        <Route path="/logs" element={<ProcessLogs />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/images" element={<Images />} />
        <Route path="/network" element={<Network />} />
        <Route path="/configuration" element={<Configuration />} />
      </Route>
    </Routes>
  );
};



export default App;
