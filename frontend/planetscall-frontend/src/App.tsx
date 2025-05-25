import React, { useEffect } from 'react';
import './App.css';
import Home from './pages/home/Home';
import { useAuth } from './context/AuthContext';
import './stylePage/globals.css';

function App() {
  const { user } = useAuth();


  return (
    <div>
      <Home/>
    </div>
  );
}

export default App;
