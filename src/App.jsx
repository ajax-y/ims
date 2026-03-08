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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (currentUser) {
      timeoutRef.current = setTimeout(() => {
        handleLogout();
        alert("You have been logged out due to 5 minutes of inactivity.");
      }, TIMEOUT_DURATION);
    }
  };

  useEffect(() => {
    // Listen to user activity to reset the inactivity timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimeout();
    
    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimeout(); // Initialize
    
    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentUser]);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await fetch('http://localhost:8000/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser({ ...data, id: data.username });
          } else {
            // API is up but token is invalid
            localStorage.removeItem('access_token');
            localStorage.removeItem('ims_current_user');
          }
        } catch (err) {
          console.error("Session verification failed, applying offline fallback", err);
          // Fallback to local user state if API is completely unreachable
          const localStoredUser = JSON.parse(localStorage.getItem('ims_current_user') || 'null');
          if (localStoredUser) {
            setCurrentUser(localStoredUser);
          } else {
            localStorage.removeItem('access_token');
          }
        }
      }
      setLoading(false);
    };
    
    checkSession();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    resetTimeout();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('ims_current_user');
    setCurrentUser(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading IMS...</div>;
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Very simple role-based routing
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
