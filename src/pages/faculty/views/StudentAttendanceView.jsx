import React, { useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { useData } from '../../../context/DataContext';
import { Info } from 'lucide-react';

function StudentAttendanceView({ user }) {
  const { getStudentsByClass } = useUser();
  const { incrementClassAttendance, getStudentAttendanceStats, getAssignmentsForFaculty } = useData();
  
  const assignments = getAssignmentsForFaculty(user?.id);

  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  
  // Local state for the current submission session mapping { studentId: boolean (present) }
  const [currentSession, setCurrentSession] = useState({});

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    
    if (cls) {
      const clsStudents = getStudentsByClass(cls);
      setStudents(clsStudents);
      
      // Initialize session as present by default
      const initSession = {};
      clsStudents.forEach(s => initSession[s.id] = true);
      setCurrentSession(initSession);
    } else {
      setStudents([]);
      setCurrentSession({});
    }
  };

  const markAll = (isPresent) => {
    const newSession = {};
    students.forEach(s => newSession[s.id] = isPresent);
    setCurrentSession(newSession);
  };

  const toggleStudent = (id, isPresent) => {
    setCurrentSession(prev => ({
      ...prev,
      [id]: isPresent
    }));
  };

  const handleSubmit = () => {
    if (students.length === 0) return;
    
    // Extract arrays for the transaction
    const studentIds = students.map(s => s.id);
    const presentIds = Object.keys(currentSession).filter(id => currentSession[id]);
    
    // Commit to context
    incrementClassAttendance(studentIds, presentIds);
    alert('Attendance Saved Successfully and incremented for this class session!');
  };

  if (assignments.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Mark Student Attendance</h2>
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
          <Info size={48} style={{ color: '#94a3b8', margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No Classes Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            You cannot mark attendance because you have not been assigned to any classes yet. Please contact the Admin for assignment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Mark Student Attendance</h2>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <label>Select Assigned Class</label>
          <select value={selectedClass} onChange={handleClassChange}>
            <option value="">-- Choose Class --</option>
            {assignments.map(a => (
              <option key={a.id} value={a.assignedClassNode}>{a.assignedClassNode} ({a.subject})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }} onClick={() => markAll(true)}>
              Mark All Present
            </button>
            <button className="btn btn-danger" onClick={() => markAll(false)}>
              Mark All Absent
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Student Name</th>
                  <th>Past Stats</th>
                  <th>Current Log</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const isPresent = currentSession[student.id] ?? true;
                  const stats = getStudentAttendanceStats(student.id);
                  const attPerc = stats.completedPeriods > 0 
                    ? Math.round((stats.attendedPeriods / stats.completedPeriods) * 100) 
                    : 0;

                  return (
                    <tr key={student.id}>
                      <td className="font-bold">{student.id.toUpperCase()}</td>
                      <td>{student.name}</td>
                      <td className="text-muted text-sm">
                        {stats.attendedPeriods} / {stats.completedPeriods} ({attPerc}%)
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: isPresent ? 'var(--success)' : '#e2e8f0', color: isPresent ? 'white' : 'var(--text-main)' }}
                            onClick={() => toggleStudent(student.id, true)}
                          >
                            Present
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: !isPresent ? 'var(--danger)' : '#e2e8f0', color: !isPresent ? 'white' : 'var(--text-main)' }}
                            onClick={() => toggleStudent(student.id, false)}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {students.length === 0 && (
                  <tr><td colSpan="4" className="text-center text-muted">No students found for this class.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleSubmit}>
            Save Attendance
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentAttendanceView;
