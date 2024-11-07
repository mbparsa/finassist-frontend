import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateUserPage from './pages/CreateUserPage';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Create User</Link>
        {' | '}
        <Link to="/users">Users</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CreateUserPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
