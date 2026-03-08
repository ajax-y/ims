import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

// Default initial state matching user request
const DEFAULT_USERS = [
  { id: 'aden', password: '12345', name: 'Aden Admin', role: 'admin' },
  { id: 'ajay', password: '12345', name: 'Ajay', role: 'faculty' },
  { id: 'aldrin', password: '12345', name: 'Aldrin', role: 'student', department: 'B.E.ECE/01/A' },
  { id: 'kaviya', password: '12345', name: 'Kaviya', role: 'student', department: 'B.E.CSE/02/B' }
];

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ims_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed parsing users", e);
      }
    }
    return DEFAULT_USERS;
  });

  useEffect(() => {
    localStorage.setItem('ims_users', JSON.stringify(users));
  }, [users]);

  // Authenticate user
  const loginUser = async (id, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', id);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      if (!response.ok) return null;

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);

      // fetch user profile
      const userRes = await fetch('http://localhost:8000/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      if (!userRes.ok) return null;
      const userData = await userRes.json();
      
      return { ...userData, id: userData.username };
    } catch(err) {
      console.error(err);
      return null;
    }
  };

  const addUser = (newUser) => {
    // Check if ID already exists
    if (users.some(u => u.id.toLowerCase() === newUser.id.toLowerCase())) {
      return false; // User exists
    }
    setUsers([...users, newUser]);
    return true;
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const clearAllUsersExceptSelf = (currentAdminId) => {
    setUsers(users.filter(u => u.id === currentAdminId));
  };

  const resetToDefaults = () => {
    setUsers(DEFAULT_USERS);
  };

  const getStudentsByClass = (className) => {
    return users.filter(u => u.role === 'student' && u.department === className);
  };

  const getStats = () => {
    const studentCount = users.filter(u => u.role === 'student').length;
    const facultyCount = users.filter(u => u.role === 'faculty').length;
    const adminCount = users.filter(u => u.role === 'admin').length;
    return { studentCount, facultyCount, adminCount };
  };

  const updateUserProfile = (userId, newProfileData) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, ...newProfileData } : u
      )
    );
  };

  return (
    <UserContext.Provider value={{ 
      users, loginUser, addUser, deleteUser, clearAllUsersExceptSelf, 
      resetToDefaults, getStudentsByClass, getStats, updateUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
}
