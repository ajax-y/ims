import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

// Convert letter grade to grade points
const getGradePoints = (grade) => {
  switch (grade) {
    case 'O': return 10;
    case 'A+': return 9;
    case 'A': return 8;
    case 'B+': return 7;
    case 'B': return 6;
    case 'C': return 5;
    default: return 0;
  }
};

export function DataProvider({ children }) {
  // Store marks map: { studentId: { 'CAT Marks': { 'C01': 95, ... }, ... } }
  const [marks, setMarks] = useState(() => {
    const saved = localStorage.getItem('ims_marks');
    return saved ? JSON.parse(saved) : {};
  });

  // Store attendance map structurally: 
  // { studentId: { completedPeriods: 100, attendedPeriods: 85 } }
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('ims_attendance_struct');
    return saved ? JSON.parse(saved) : {};
  });

  // Store faculty assignments:
  // Array of { id, facultyId, year, department, section, subject }
  const [facultyAssignments, setFacultyAssignments] = useState(() => {
    const saved = localStorage.getItem('ims_faculty_assignments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ims_marks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem('ims_attendance_struct', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('ims_faculty_assignments', JSON.stringify(facultyAssignments));
  }, [facultyAssignments]);

  const assignClassToFaculty = (assignment) => {
    const newAssignment = {
      ...assignment,
      id: Date.now().toString()
    };
    setFacultyAssignments(prev => [...prev, newAssignment]);
  };

  const getAssignmentsForFaculty = (facultyId) => {
    return facultyAssignments.filter(a => a.facultyId === facultyId);
  };

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

  // Helper to calculate CGPA
  const getCGPA = (studentId) => {
    // Assuming simple average for demonstration.
    // To calculate CGPA properly, we'll average the CAT marks out of 10 for simplicity
    // Or if there's a specific "Semester Final" we'd use that.
    // For this context, let's derive it from CAT Marks C01-C05
    const catMarks = getStudentMarks(studentId, 'CAT Marks');
    const values = Object.values(catMarks).map(v => parseInt(v) || 0);
    if (values.length === 0) return 0.00;
    
    // Scale marks (out of 100) to GPA (out of 10)
    const gpaSum = values.reduce((acc, curr) => acc + (curr / 10), 0);
    return (gpaSum / values.length).toFixed(2);
  };

  // Transactional style attendance update
  const incrementClassAttendance = (studentIds, presentIds) => {
    setAttendance(prev => {
      const next = { ...prev };
      
      studentIds.forEach(id => {
        const currentStats = next[id] || { completedPeriods: 0, attendedPeriods: 0 };
        const isPresent = presentIds.includes(id);
        
        next[id] = {
          completedPeriods: currentStats.completedPeriods + 1,
          attendedPeriods: isPresent ? currentStats.attendedPeriods + 1 : currentStats.attendedPeriods
        };
      });
      
      return next;
    });
  };

  const getStudentAttendanceStats = (studentId) => {
    return attendance[studentId] || { completedPeriods: 0, attendedPeriods: 0 };
  };

  const clearAllData = () => {
    setMarks({});
    setAttendance({});
  };

  return (
    <DataContext.Provider value={{ 
      marks, updateMark, getStudentMarks, getCGPA,
      attendance, incrementClassAttendance, getStudentAttendanceStats,
      facultyAssignments, assignClassToFaculty, getAssignmentsForFaculty,
      clearAllData
    }}>
      {children}
    </DataContext.Provider>
  );
}
