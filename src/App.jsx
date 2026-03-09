import React, { useState, useEffect, useRef } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  // 5 Minutes in milliseconds
  const TIMEOUT_DURATION = 5 * 60 * 1000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentUser) {
      timeoutRef.current = setTimeout(() => {
        handleLogout();
        alert("You have been logged out due to 5 minutes of inactivity.");
      }, TIMEOUT_DURATION);
    }
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimeout();
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimeout();
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentUser]);

  // Restore session from localStorage (set by loginUser in UserContext)
  useEffect(() => {
    const stored = localStorage.getItem('ims_current_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('ims_current_user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    resetTimeout();
  };

  const handleLogout = () => {
    localStorage.removeItem('ims_current_user');
    setCurrentUser(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading IMS...
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  switch (currentUser.role) {
    case 'student':
      return <StudentDashboard user={currentUser} onLogout={handleLogout} />;
    case 'faculty':
      return <FacultyDashboard user={currentUser} onLogout={handleLogout} />;
    case 'admin':
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    default:
      return <div>Unknown Role <button onClick={handleLogout}>Logout</button></div>;
  }
}

export default App;
