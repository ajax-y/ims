import React, { useState } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { useUser } from '../../../context/UserContext';
import { useData } from '../../../context/DataContext';

const MarksEntryTable = ({ title, columns }) => {
  const { classes } = useClasses();
  const { getStudentsByClass } = useUser();
  const { getStudentMarks, updateMark } = useData();
  
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    setStudents(getStudentsByClass(cls));
  };

  const handleMarkChange = (id, col, val) => {
    updateMark(id, title, col, val);
  };

  const handleSubmit = () => {
    alert(`${title} Saved Successfully to System!`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>{title} Entry</h2>

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
        <div className="card table-container" style={{ padding: '1.5rem' }}>
          <table>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Student Name</th>
                {columns.map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td className="font-bold">{student.id.toUpperCase()}</td>
                  <td>{student.name}</td>
                  {columns.map(col => {
                    const currentMark = getStudentMarks(student.id, title)[col] || '';
                    return (
                      <td key={col}>
                        <input 
                          type="number" 
                          value={currentMark}
                          onChange={(e) => handleMarkChange(student.id, col, e.target.value)}
                          style={{ width: '60px', padding: '0.25rem' }}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={columns.length + 2} className="text-center text-muted">No students found for this class.</td></tr>
              )}
            </tbody>
          </table>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleSubmit}>
            Save Marks
          </button>
        </div>
      )}
    </div>
  );
};

export const FacultyCATMarks = () => (
  <MarksEntryTable title="CAT Marks" columns={['C01', 'C02', 'C03', 'C04', 'C05']} />
);

export const FacultyLabMarks = () => (
  <MarksEntryTable title="LAB Marks" columns={['Cycle 1', 'Cycle 2', 'Cycle 3']} />
);

export const FacultyAssignmentMarks = () => (
  <MarksEntryTable title="Assignment Marks" columns={['A01', 'A02', 'A03', 'A04', 'A05']} />
);
