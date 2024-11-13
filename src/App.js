import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; // Assuming this is the correct path
import FinancialStatus from './pages/FinancialStatus'; // Create this component as needed
import SettingsPage from './pages/SettingsPage'; // Create this component as needed
import './App.css'; // Assuming a new CSS file for styling

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Navigation Bar */}
        <nav className="main-navbar">
          <div className="logo">FinAssist</div>
          <div className="nav-links">
            <NavLink to="/home" className="nav-link" activeClassName="active-link">
              Home
            </NavLink>
            <NavLink to="/financial-status" className="nav-link" activeClassName="active-link">
              Financial Status
            </NavLink>
            <NavLink to="/settings" className="nav-link" activeClassName="active-link">
              Settings
            </NavLink>
          </div>
        </nav>

        {/* Routes Setup */}
        <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/financial-status" element={<FinancialStatus />} />
          <Route path="/settings-page" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
