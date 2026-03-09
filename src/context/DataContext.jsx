import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

// Convert letter grade to grade points
const getGradePoints = (grade) => {
  switch (grade) {
    case 'O':  return 10;
    case 'A+': return 9;
    case 'A':  return 8;
    case 'B+': return 7;
    case 'B':  return 6;
    case 'C':  return 5;
    default:   return 0;
  }
};

export function DataProvider({ children }) {
  // Local state mirrors — populated from Supabase on mount
  const [marks, setMarks] = useState({});
  const [attendance, setAttendance] = useState({});
  const [facultyAssignments, setFacultyAssignments] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchMarks(), fetchAttendance(), fetchFacultyAssignments()]);
  };

  // ---- MARKS ----
  const fetchMarks = async () => {
    const { data, error } = await supabase.from('marks').select('*');
    if (error) { console.error('fetchMarks:', error.message); return; }
    // Rebuild nested map: { studentId: { examType: { subject: value } } }
    const map = {};
    (data || []).forEach(row => {
      if (!map[row.student_id]) map[row.student_id] = {};
      if (!map[row.student_id][row.exam_type]) map[row.student_id][row.exam_type] = {};
      map[row.student_id][row.exam_type][row.subject] = row.value;
    });
    setMarks(map);
  };

  const updateMark = async (studentId, examType, subject, value) => {
    // Upsert by natural key (student_id, exam_type, subject)
    const { error } = await supabase.from('marks').upsert(
      [{ student_id: studentId, exam_type: examType, subject, value }],
      { onConflict: 'student_id,exam_type,subject' }
    );
    if (error) { console.error('updateMark:', error.message); return; }

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

  const getCGPA = (studentId) => {
    const catMarks = getStudentMarks(studentId, 'CAT Marks');
    const values = Object.values(catMarks).map(v => parseInt(v) || 0);
    if (values.length === 0) return '0.00';
    const gpaSum = values.reduce((acc, curr) => acc + (curr / 10), 0);
    return (gpaSum / values.length).toFixed(2);
  };

  // ---- ATTENDANCE ----
  const fetchAttendance = async () => {
    const { data, error } = await supabase.from('attendance').select('*');
    if (error) { console.error('fetchAttendance:', error.message); return; }
    // Rebuild map: { studentId: { completedPeriods, attendedPeriods } }
    const map = {};
    (data || []).forEach(row => {
      map[row.student_id] = {
        completedPeriods: row.completed_periods,
        attendedPeriods:  row.attended_periods,
      };
    });
    setAttendance(map);
  };

  const incrementClassAttendance = async (studentIds, presentIds) => {
    for (const studentId of studentIds) {
      const current = attendance[studentId] || { completedPeriods: 0, attendedPeriods: 0 };
      const isPresent = presentIds.includes(studentId);
      const updated = {
        student_id:        studentId,
        completed_periods: current.completedPeriods + 1,
        attended_periods:  isPresent ? current.attendedPeriods + 1 : current.attendedPeriods,
      };
      const { error } = await supabase.from('attendance').upsert(
        [updated],
        { onConflict: 'student_id' }
      );
      if (error) console.error('incrementAttendance:', studentId, error.message);
    }
    await fetchAttendance();
  };

  const getStudentAttendanceStats = (studentId) => {
    return attendance[studentId] || { completedPeriods: 0, attendedPeriods: 0 };
  };

  // ---- FACULTY ASSIGNMENTS ----
  const fetchFacultyAssignments = async () => {
    const { data, error } = await supabase.from('faculty_assignments').select('*');
    if (error) { console.error('fetchFacultyAssignments:', error.message); return; }
    setFacultyAssignments(data || []);
  };

  const assignClassToFaculty = async (assignment) => {
    const row = {
      faculty_id:          assignment.facultyId,
      year:                assignment.year,
      department:          assignment.department,
      section:             assignment.section,
      subject:             assignment.subject,
      assigned_class_node: assignment.assignedClassNode,
    };
    const { data, error } = await supabase.from('faculty_assignments').insert([row]).select();
    if (error) { console.error('assignClassToFaculty:', error.message); return; }
    setFacultyAssignments(prev => [...prev, ...(data || [])]);
  };

  const getAssignmentsForFaculty = (facultyId) => {
    return facultyAssignments.filter(a => a.faculty_id === facultyId);
  };

  const getSubjectsForStudent = (classNode) => {
    return facultyAssignments.filter(a => a.assigned_class_node === classNode);
  };

  const clearAllData = async () => {
    await supabase.from('marks').delete().neq('student_id', '');
    await supabase.from('attendance').delete().neq('student_id', '');
    setMarks({});
    setAttendance({});
  };

  return (
    <DataContext.Provider value={{
      marks, updateMark, getStudentMarks, getCGPA,
      attendance, incrementClassAttendance, getStudentAttendanceStats,
      facultyAssignments, assignClassToFaculty, getAssignmentsForFaculty, getSubjectsForStudent,
      clearAllData, fetchAll
    }}>
      {children}
    </DataContext.Provider>
  );
}
