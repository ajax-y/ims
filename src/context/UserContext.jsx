import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

// SHA-256 hash (same salt as before for backward compat)
const hashPassword = async (password) => {
  if (!password) return '';
  const msgUint8 = new TextEncoder().encode(password + "_ims_secure_salt_v2");
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users from Supabase on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      console.error('Failed to fetch users:', error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  // Authenticate user against Supabase
  const loginUser = async (id, password) => {
    const hashedInput = await hashPassword(password);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Login: user not found', error?.message);
      return null;
    }

    // Support both hashed and legacy plain-text passwords
    if (data.password_hash !== hashedInput && data.password_hash !== password) {
      console.error('Login: invalid password');
      return null;
    }

    const user = { ...data, id: data.id };
    localStorage.setItem('ims_current_user', JSON.stringify(user));
    return user;
  };

  const addUser = async (newUser) => {
    const hashedPassword = await hashPassword(newUser.password);
    const userToInsert = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      department: newUser.department || null,
      password_hash: hashedPassword,
    };

    const { error } = await supabase.from('users').insert([userToInsert]);
    if (error) {
      console.error('addUser failed:', error.message);
      return false;
    }
    await fetchUsers();
    return true;
  };

  const deleteUser = async (id) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      console.error('deleteUser failed:', error.message);
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };


  const getStudentsByClass = (className) => {
    return users.filter(u => u.role === 'student' && u.department === className);
  };

  const getStats = () => {
    const studentCount = users.filter(u => u.role === 'student').length;
    const facultyCount = users.filter(u => u.role === 'faculty').length;
    const adminCount   = users.filter(u => u.role === 'admin').length;
    return { studentCount, facultyCount, adminCount };
  };

  const updateUserProfile = async (userId, newProfileData) => {
    let finalData = { ...newProfileData };
    if (finalData.password) {
      finalData.password_hash = await hashPassword(finalData.password);
      delete finalData.password;
    }

    const { error } = await supabase
      .from('users')
      .update(finalData)
      .eq('id', userId);

    if (error) {
      console.error('updateUserProfile failed:', error.message);
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...finalData } : u));
    // Update cached session if current user
    const stored = JSON.parse(localStorage.getItem('ims_current_user') || 'null');
    if (stored && stored.id === userId) {
      localStorage.setItem('ims_current_user', JSON.stringify({ ...stored, ...finalData }));
    }
  };

  return (
    <UserContext.Provider value={{
      users, loading, loginUser, addUser, deleteUser,
      getStudentsByClass, getStats, updateUserProfile, fetchUsers
    }}>
      {children}
    </UserContext.Provider>
  );
}
