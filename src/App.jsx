import React, { useState } from 'react';
import Login from './pages/Login';
import StudentDashboard from './pages/student/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // null means not logged in

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

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
