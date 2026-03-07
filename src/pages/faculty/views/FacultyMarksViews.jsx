import React, { useState } from 'react';

const studentsData = [
  { id: 'STU001', name: 'Alice Smith' },
  { id: 'STU002', name: 'Bob Johnson' },
  { id: 'STU003', name: 'Charlie Brown' },
];

const MarksEntryTable = ({ title, columns }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [marks, setMarks] = useState({});

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    const initial = {};
    studentsData.forEach(s => {
      initial[s.id] = columns.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    });
    setMarks(initial);
  };

  const handleMarkChange = (id, col, val) => {
    setMarks(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [col]: val
      }
    }));
  };

  const handleSubmit = () => {
    alert(`${title} Saved Successfully!`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>{title} Entry</h2>

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
              {studentsData.map(student => (
                <tr key={student.id}>
                  <td className="font-bold">{student.id}</td>
                  <td>{student.name}</td>
                  {columns.map(col => (
                    <td key={col}>
                      <input 
                        type="number" 
                        value={marks[student.id]?.[col] || ''}
                        onChange={(e) => handleMarkChange(student.id, col, e.target.value)}
                        style={{ width: '60px', padding: '0.25rem' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
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
