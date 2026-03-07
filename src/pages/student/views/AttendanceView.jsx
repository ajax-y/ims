import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';

function AttendanceView({ user }) {
  const { getStudentAttendanceStats, getSubjectsForStudent } = useData();
  const [sem, setSem] = useState('01');
  
  const mySubjects = getSubjectsForStudent(user?.department);
  const globalStats = getStudentAttendanceStats(user?.id);

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
            {mySubjects.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted">No subjects assigned by admin yet.</td></tr>
            ) : mySubjects.map((row, idx) => {
              // Simulated breakdown of global structural transaction stats 
              // across all subjects
              const total = Math.ceil(globalStats.completedPeriods / (mySubjects.length || 1));
              
              // Simplistic division for attendance allocation display purposes
              let attended = 0;
              if (total > 0) {
                 const overallPerc = globalStats.attendedPeriods / globalStats.completedPeriods;
                 attended = Math.round(overallPerc * total);
              }

              const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
              const isLow = percentage < 75;
              
              // Try to parse faculty name if possible, otherwise use ID.
              // We'll just display the facultyId which is assigned.
              const facName = row.facultyId || 'Unknown';
              
              return (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td>
                  <td>-</td>
                  <td className="font-bold">{row.subject}</td>
                  <td>{facName}</td>
                  <td>{attended}</td>
                  <td>{total}</td>
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
