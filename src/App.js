import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import LandingPage from './pages/Home'; // Assuming this is the correct path
import SettingsPage from './pages/Setting_Page'; // Create this component as needed
import './App.css'; // Assuming a new CSS file for styling
import Menu from './components/Menu';
import AppRoutes from './components/Routes';

const App = () => {
  return (
    
    <Router>
      <div className="app">
        <Menu/>
          {/* Routes Setup */}
        <AppRoutes/>
      </div>

    </Router>


    
  );
};

export default App;
