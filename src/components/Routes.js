import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from '../pages/Profile.js';
import Dashboard_ from '../pages/Dashboard_';
import Merchant from '../pages/Merchant';
import Category from '../pages/Category';
import Setting_Page from '../pages/Setting_Page';
 import Logout from '../pages/Logout';
import SettingPage from '../pages/Setting_Page';
import Menu from './Menu';
import Home from '../pages/Home';


const AppRoutes = () => {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard_ />} />
        <Route path="/merchant" element={<Merchant />} />
        <Route path="/category" element={<Category />} />
        <Route path="/settings" element={<Setting_Page />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>

  );
};

export default AppRoutes;