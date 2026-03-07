import React, { useState } from 'react';

const studentsData = [
  { id: 'STU001', name: 'Alice Smith' },
  { id: 'STU002', name: 'Bob Johnson' },
  { id: 'STU003', name: 'Charlie Brown' },
];

function StudentAttendanceView() {
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState({});

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    // Reset attendance
    const initial = {};
    studentsData.forEach(s => initial[s.id] = 'Present');
    setAttendance(initial);
  };

  const markAll = (status) => {
    const updated = {};
    studentsData.forEach(s => updated[s.id] = status);
    setAttendance(updated);
  };

  const toggleStudent = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
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
            <option value="B.E.ECE/01/A">B.E.ECE/01/A</option>
            <option value="B.E.CSE/02/B">B.E.CSE/02/B</option>
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
                {studentsData.map(student => (
                  <tr key={student.id}>
                    <td className="font-bold">{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      <span className={attendance[student.id] === 'Present' ? 'text-success font-bold' : 'text-danger font-bold'}>
                        {attendance[student.id]}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: attendance[student.id] === 'Present' ? 'var(--success)' : '#e2e8f0', color: attendance[student.id] === 'Present' ? 'white' : 'var(--text-main)' }}
                          onClick={() => toggleStudent(student.id, 'Present')}
                        >
                          Present
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: attendance[student.id] === 'Absent' ? 'var(--danger)' : '#e2e8f0', color: attendance[student.id] === 'Absent' ? 'white' : 'var(--text-main)' }}
                          onClick={() => toggleStudent(student.id, 'Absent')}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
