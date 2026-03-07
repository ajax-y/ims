import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  // Store marks map: { studentId: { 'CAT Marks': { 'C01': 95, ... }, ... } }
  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem('ims_marks');
    return saved ? JSON.parse(saved) : {};
  });

  // Store attendance map: { studentId: { date_or_subject: 'Present' } }
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('ims_attendance');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('ims_marks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem('ims_attendance', JSON.stringify(attendance));
  }, [attendance]);

  const updateMark = (studentId, examType, subject, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [examType]: {
          ...((prev[studentId] && prev[studentId][examType]) || {}),
          [subject]: value
        }
      }
    }));
  };

  const getStudentMarks = (studentId, examType) => {
    if (!marks[studentId] || !marks[studentId][examType]) return {};
    return marks[studentId][examType];
  };

  const updateAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const getStudentAttendance = (studentId) => {
    return attendance[studentId] || 'Not Marked';
  };

  const clearAllData = () => {
    setMarks({});
    setAttendance({});
  };

  return (
    <DataContext.Provider value={{ 
      marks, updateMark, getStudentMarks,
      attendance, updateAttendance, getStudentAttendance,
      clearAllData
    }}>
      {children}
    </DataContext.Provider>
  );
}
