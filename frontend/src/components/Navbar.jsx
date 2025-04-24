import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import { FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleProfile = () => setShowProfile(!showProfile);

  useEffect(() => {
    // Fetch user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // just clears session info
    navigate('/login');
  };

  return (
    <>
      {/* Hamburger Icon */}
      {!isOpen && (
        <div className="hamburger" onClick={toggleNavbar}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      )}

      {/* Sidebar */}
      <nav className={isOpen ? "navbar open" : "navbar"}>
        <div className="close-icon" onClick={toggleNavbar}>
          <FaTimes />
        </div>
        <h1 className="nav-title">Edu-Timely 🚀</h1>
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Calendar</NavLink>
          <NavLink to="/agenda" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Agenda</NavLink>
          <NavLink to="/pomodoro" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Pomodoro</NavLink>
          <NavLink to="/notes" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Notes</NavLink>
          <NavLink to="/grades" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Grade Tracker</NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link nav-active' : 'nav-link'}>Tasks</NavLink>
        </div>
      </nav>

      {/* Floating Profile Button */}
      {user && user.username && (
        <div className="profile-floating" onClick={toggleProfile}>
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Profile" />
        </div>
      )}

      {/* Profile Card */}
      {showProfile && user && (
        <div className="profile-card">
          <h3>User Name: {user.username}</h3>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
}
