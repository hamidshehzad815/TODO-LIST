import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking localStorage or a similar method
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <img
          src={require("../../images/LOGO.png")}
          alt="Zentask Logo"
          className="logo-circle"
        />

        <span className="logo-text">TaskFlow</span>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#blog">Blog</a>
        <a href="#support">Support</a>
      </nav>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="btn btn-primary">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
            <button onClick={toggleSidebar} className="btn btn-menu">
              Menu
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Signup
            </Link>
          </>
        )}
      </div>
      {isSidebarOpen && (
        <div className="sidebar">
          <button onClick={toggleSidebar} className="close-sidebar-btn">
            &rarr;
          </button>
          <ul>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
