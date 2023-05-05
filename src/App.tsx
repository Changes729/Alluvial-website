import React from 'react';
import { RouterProvider } from 'react-router';
import router from './AppRouter'
import './App.css';

const App = () => (
  <div>
    <RouterProvider router={router}></RouterProvider>
  </div>
);

export default App;
