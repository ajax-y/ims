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

  useEffect(() => {
    localStorage.setItem('ims_classes', JSON.stringify(classes));
  }, [classes]);

  const addClass = (newClass) => {
    if (newClass && !classes.includes(newClass)) {
      setClasses([...classes, newClass]);
    }
  };

  const deleteClass = (classToDelete) => {
    setClasses(classes.filter(c => c !== classToDelete));
  };

  return (
    <ClassContext.Provider value={{ classes, addClass, deleteClass }}>
      {children}
    </ClassContext.Provider>
  );
}
