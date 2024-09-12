import './App.css';
import { Outlet } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar'


function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
