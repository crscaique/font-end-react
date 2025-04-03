import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/GlobalStyles.css';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('Token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('Token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <h1>To Do Notes App</h1>
          </div>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
