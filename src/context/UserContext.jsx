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
  const loginUser = (id, password) => {
    return users.find(u => u.id.toLowerCase() === id.toLowerCase() && u.password === password) || null;
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

  return (
    <UserContext.Provider value={{ 
      users, loginUser, addUser, deleteUser, clearAllUsersExceptSelf, 
      resetToDefaults, getStudentsByClass, getStats 
    }}>
      {children}
    </UserContext.Provider>
  );
}
