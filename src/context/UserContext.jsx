import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

// Default initial state matching user request
// Industry Standard Asynchronous SHA-256 Hash via Web Crypto API
const hashPassword = async (password) => {
  if (!password) return '';
  const msgUint8 = new TextEncoder().encode(password + "_ims_secure_salt_v2");
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // Convert buffer to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

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
    // Return pre-compiled hashed defaults if nothing in localStorage
    const defaultHashedPass = 'b5ef1b8c42abdd1c1dd339a2ae8358ed88adcdb251c000af735f069e62213c49';
    return [
      { id: 'aden', password: defaultHashedPass, name: 'Aden Admin', role: 'admin' },
      { id: 'ajay', password: defaultHashedPass, name: 'Ajay', role: 'faculty' },
      { id: 'aldrin', password: defaultHashedPass, name: 'Aldrin', role: 'student', department: 'B.E.ECE/01/A' },
      { id: 'kaviya', password: defaultHashedPass, name: 'Kaviya', role: 'student', department: 'B.E.CSE/02/B' }
    ];
  });

  useEffect(() => {
    // Ensure the users are saved to local storage on initial boot
    if (!localStorage.getItem('ims_users')) {
      localStorage.setItem('ims_users', JSON.stringify(users));
    }
  }, [users]);

  // Authenticate user
  const loginUser = async (id, password) => {
    // Backend is down, so bypass API entirely to make login instant.
    console.log("Backend offline override: Instant local login");
    
    const hashedInput = await hashPassword(password);
    const localUser = users.find(u => {
      const matchId = u.id === id || u.username === id;
      // Allow legacy plain-text match for backward compatibility, prefer hashed
      const matchPass = u.password === hashedInput || u.password === password;
      return matchId && matchPass;
    });

    if (localUser) {
      // Create a mock token for local session
      localStorage.setItem('access_token', 'mock_local_token_' + Date.now());
      localStorage.setItem('ims_current_user', JSON.stringify(localUser));
      return localUser;
    }
    
    console.error("Login failed: Invalid credentials");
    return null;
  };

  const addUser = async (newUser) => {
    // Check if ID already exists
    if (users.some(u => u.id.toLowerCase() === newUser.id.toLowerCase())) {
      return false; // User exists
    }
    
    const hashedNewPassword = await hashPassword(newUser.password);
    const userToSave = { ...newUser, password: hashedNewPassword };
    setUsers(prev => [...prev, userToSave]);
    return true;
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const clearAllUsersExceptSelf = (currentAdminId) => {
    setUsers(users.filter(u => u.id === currentAdminId));
  };

  const resetToDefaults = async () => {
    const defaultHashedPass = 'b5ef1b8c42abdd1c1dd339a2ae8358ed88adcdb251c000af735f069e62213c49';
    setUsers([
      { id: 'aden', password: defaultHashedPass, name: 'Aden Admin', role: 'admin' },
      { id: 'ajay', password: defaultHashedPass, name: 'Ajay', role: 'faculty' },
      { id: 'aldrin', password: defaultHashedPass, name: 'Aldrin', role: 'student', department: 'B.E.ECE/01/A' },
      { id: 'kaviya', password: defaultHashedPass, name: 'Kaviya', role: 'student', department: 'B.E.CSE/02/B' }
    ]);
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

  const updateUserProfile = async (userId, newProfileData) => {
    let finalData = { ...newProfileData };
    if (finalData.password) {
      // Fetch the user to check if password changed
      const usr = users.find(u => u.id === userId);
      if (usr && finalData.password !== usr.password) {
        finalData.password = await hashPassword(finalData.password);
      }
    }

    setUsers(prevUsers => 
      prevUsers.map(u => u.id === userId ? { ...u, ...finalData } : u)
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
