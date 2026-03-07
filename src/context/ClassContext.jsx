import React, { createContext, useContext, useState, useEffect } from 'react';

const ClassContext = createContext();

export function useClasses() {
  return useContext(ClassContext);
}

export function ClassProvider({ children }) {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('ims_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['B.E.ECE/01/A', 'B.E.CSE/02/B'];
      }
    }
    return ['B.E.ECE/01/A', 'B.E.CSE/02/B'];
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('ims_departments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['ECE', 'CSE', 'EEE', 'MECH'];
      }
    }
    return ['ECE', 'CSE', 'EEE', 'MECH'];
  });

  useEffect(() => {
    localStorage.setItem('ims_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('ims_departments', JSON.stringify(departments));
  }, [departments]);

  const addClass = (newClass) => {
    if (newClass && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
    }
  };

  const deleteClass = (classToDelete) => {
    setClasses(classes.filter(c => c !== classToDelete));
  };

  const addDepartment = (newDept) => {
    if (newDept && !departments.includes(newDept)) {
      setDepartments([...departments, newDept]);
    }
  };

  const deleteDepartment = (deptToDelete) => {
    setDepartments(departments.filter(d => d !== deptToDelete));
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
