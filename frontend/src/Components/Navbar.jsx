import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🎬 MovieApp</h2>
      </div>
      
      <div className="nav-links">
        <Link 
          to="/movies" 
          className={location.pathname === "/movies" ? "active" : ""}
        >
          Search Movies
        </Link>
        <Link 
          to="/saved" 
          className={location.pathname === "/saved" ? "active" : ""}
        >
          Saved Movies
        </Link>
      </div>
      
      <div className="nav-user">
        <span className="welcome-message">Welcome, {user?.email}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;