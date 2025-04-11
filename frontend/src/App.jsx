import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskManager from './components/TaskManager';
import CalendarApp from './components/Calendar';
import Agenda from './components/Agenda';
import Pomodoro from './components/Pomodoro';
import NotesPicker from './components/NotesPicker';
import GradeTracker from './components/GradeTracker';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ProfileFloating from './components/ProfileFloating';
import './components/LoginPage.css';
import './components/Signup.css';
import './components/TaskManager.css';
import './components/ProfileFloating.css';
import './components/PomodoroTimer.css';
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Theme State (Dark/Light)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Apply theme to body
  }, [theme]);

  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    if (storedUser) setUserId(storedUser);
  }, []);

  // Handle Login
  const handleLogin = useCallback((id) => {
    localStorage.setItem('userId', id);
    setUserId(id);
    navigate('/');
  }, [navigate]);

  // Handle Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setUserId(null);
    navigate('/login');
  }, [navigate]);

  // Hide Navbar on Login/Signup Pages
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className={`app-container ${theme}`}>
      {/* Navbar & Floating Profile */}
      {!hideNavbar && <Navbar userId={userId} onLogout={handleLogout} theme={theme} setTheme={setTheme} />}
      {!hideNavbar && <ProfileFloating onLogout={handleLogout} />}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login onAuthSuccess={handleLogin} />} />
          <Route path="/signup" element={<Signup onAuthSuccess={handleLogin} />} />

          {/* Protected Routes */}
          {userId ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/calendar" element={<CalendarApp userId={userId} />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/notes" element={<NotesPicker />} />
              <Route path="/grades" element={<GradeTracker />} />
              <Route path="/tasks" element={<TaskManager />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}