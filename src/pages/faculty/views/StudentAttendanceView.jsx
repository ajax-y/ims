import React, { useState, useEffect } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { useUser } from '../../../context/UserContext';
import { useData } from '../../../context/DataContext';

function StudentAttendanceView() {
  const { classes } = useClasses();
  const { getStudentsByClass } = useUser();
  const { updateAttendance, getStudentAttendance } = useData();
  
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    setStudents(getStudentsByClass(cls));
  };

  const markAll = (status) => {
    students.forEach(s => updateAttendance(s.id, status));
  };

  const toggleStudent = (id, status) => {
    updateAttendance(id, status);
  };

  const handleSubmit = () => {
    alert('Attendance Saved Successfully');
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Mark Student Attendance</h2>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <label>Select Class</label>
          <select value={selectedClass} onChange={handleClassChange}>
            <option value="">-- Choose Class --</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {selectedClass && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }} onClick={() => markAll('Present')}>
              Mark All Present
            </button>
            <button className="btn btn-danger" onClick={() => markAll('Absent')}>
              Mark All Absent
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Student Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const status = getStudentAttendance(student.id);
                  return (
                    <tr key={student.id}>
                      <td className="font-bold">{student.id.toUpperCase()}</td>
                      <td>{student.name}</td>
                      <td>
                        <span className={status === 'Present' ? 'text-success font-bold' : status === 'Absent' ? 'text-danger font-bold' : 'text-muted'}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: status === 'Present' ? 'var(--success)' : '#e2e8f0', color: status === 'Present' ? 'white' : 'var(--text-main)' }}
                            onClick={() => toggleStudent(student.id, 'Present')}
                          >
                            Present
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: status === 'Absent' ? 'var(--danger)' : '#e2e8f0', color: status === 'Absent' ? 'white' : 'var(--text-main)' }}
                            onClick={() => toggleStudent(student.id, 'Absent')}
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
