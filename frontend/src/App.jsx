import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import './index.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart user={user} />} />
          </Routes>
        </div>
        <footer>
          <div className="container">
            <p>&copy; 2024 VSBECART. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
