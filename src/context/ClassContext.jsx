import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ClassContext = createContext();

export function useClasses() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchClasses();
    fetchDepartments();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase.from('classes').select('name').order('name');
    if (error) { console.error('fetchClasses:', error.message); return; }
    setClasses((data || []).map(r => r.name));
  };

  const fetchDepartments = async () => {
    const { data, error } = await supabase.from('departments').select('name').order('name');
    if (error) { console.error('fetchDepartments:', error.message); return; }
    setDepartments((data || []).map(r => r.name));
  };

  const addClass = async (newClass) => {
    if (!newClass || classes.includes(newClass)) return;
    const { error } = await supabase.from('classes').insert([{ name: newClass }]);
    if (error) { console.error('addClass:', error.message); return; }
    setClasses(prev => [...prev, newClass]);
  };

  const deleteClass = async (classToDelete) => {
    const { error } = await supabase.from('classes').delete().eq('name', classToDelete);
    if (error) { console.error('deleteClass:', error.message); return; }
    setClasses(prev => prev.filter(c => c !== classToDelete));
  };

  const addDepartment = async (newDept) => {
    if (!newDept || departments.includes(newDept)) return;
    const { error } = await supabase.from('departments').insert([{ name: newDept }]);
    if (error) { console.error('addDepartment:', error.message); return; }
    setDepartments(prev => [...prev, newDept]);
  };

  const deleteDepartment = async (deptToDelete) => {
    const { error } = await supabase.from('departments').delete().eq('name', deptToDelete);
    if (error) { console.error('deleteDepartment:', error.message); return; }
    setDepartments(prev => prev.filter(d => d !== deptToDelete));
  };

  return (
    <ClassContext.Provider value={{
      classes, addClass, deleteClass,
      departments, addDepartment, deleteDepartment
    }}>
      {children}
    </ClassContext.Provider>
  );
}
