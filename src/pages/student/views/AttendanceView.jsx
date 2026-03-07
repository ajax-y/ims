import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';

const attendanceData = [
  { id: 1, code: 'CS101', name: 'Programming in C', faculty: 'Dr. Smith', total: 40 },
  { id: 2, code: 'CS102', name: 'Data Structures', faculty: 'Prof. John', total: 40 },
  { id: 3, code: 'MA101', name: 'Engineering Math', faculty: 'Dr. Alan', total: 40 },
  { id: 4, code: 'PH101', name: 'Physics', faculty: 'Dr. Banner', total: 40 },
  { id: 5, code: 'GE101', name: 'English', faculty: 'Prof. Mary', total: 40 },
];

function AttendanceView({ user }) {
  const { getStudentAttendance } = useData();
  const [sem, setSem] = useState('01');

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Attendance Report</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>
          Academic Year : 2025-2029
        </div>
        <div className="input-group" style={{ marginBottom: 0, flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ margin: 0 }}>Semester:</label>
          <select value={sem} onChange={(e) => setSem(e.target.value)} style={{ padding: '0.25rem 0.5rem', maxWidth: '150px' }}>
            <option value="01">01 (Year 1)</option>
            <option value="02">02 (Year 1)</option>
            <option value="03">03 (Year 2)</option>
            <option value="04">04 (Year 2)</option>
            <option value="05">05 (Year 3)</option>
            <option value="06">06 (Year 3)</option>
            <option value="07">07 (Year 4)</option>
            <option value="08">08 (Year 4)</option>
          </select>
        </div>
      </div>

      <div className="card table-container" style={{ marginBottom: '1.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Faculty Name</th>
              <th>Periods Attended</th>
              <th>Total Periods</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((row) => {
              // Get actual global attendance if marked by faculty today, otherwise default to a random existing number for demo purposes
              const globalStatus = getStudentAttendance(user?.id);
              let attended = 30; // base fallback
              
              if (globalStatus === 'Present') attended += 1;
              if (globalStatus === 'Not Marked') attended = 0; // If they just joined, it's 0 until marked

              const percentage = Math.round((attended / row.total) * 100) || 0;
              const isLow = percentage < 75;
              
              return (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                  <td>{row.faculty}</td>
                  <td>{attended}</td>
                  <td>{row.total}</td>
                  <td className={isLow ? 'text-danger font-bold' : 'text-success font-bold'}>
                    {percentage}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #f87171',
        borderRadius: 'var(--radius-md)',
        color: '#b91c1c',
        fontWeight: '500'
      }}>
        ⚠️ If you secured less than 75% attendance, you are not eligible to write the particular Subject.
      </div>
    </div>
  );
}

export default AttendanceView;
