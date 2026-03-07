import React from 'react';
import { useData } from '../../../context/DataContext';
import { Info } from 'lucide-react';

const schedule = [
  { day: 'Monday', p1: 'CS101', p2: 'CS102', p3: 'MA101', p4: 'Break', p5: 'PH101', p6: 'PH101 Lab', p7: 'GE101' },
  { day: 'Tuesday', p1: 'MA101', p2: 'CS101', p3: 'PH101', p4: 'Break', p5: 'CS102', p6: 'GE101', p7: 'Library' },
  { day: 'Wednesday', p1: 'CS102', p2: 'PH101', p3: 'CS101', p4: 'Break', p5: 'MA101', p6: 'Sports', p7: 'Sports' },
  { day: 'Thursday', p1: 'PH101 Lab', p2: 'PH101 Lab', p3: 'GE101', p4: 'Break', p5: 'CS101', p6: 'MA101', p7: 'CS102' },
  { day: 'Friday', p1: 'MA101', p2: 'CS102', p3: 'CS101', p4: 'Break', p5: 'GE101', p6: 'Library', p7: 'Seminar' },
];

function TimeTableView({ user }) {
  const { getAssignmentsForFaculty } = useData();
  
  // Only query assignments if the profile looking at this view is a faculty member
  const isFaculty = user?.role === 'faculty';
  const assignments = isFaculty ? getAssignmentsForFaculty(user?.id) : [];

  if (isFaculty && assignments.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Personal Timetable</h2>
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
          <Info size={48} style={{ color: '#94a3b8', margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No Schedule Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            You have not been assigned to any classes yet, so a personal timetable cannot be generated. Please contact the Admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'inline-block',
        backgroundColor: 'var(--primary)',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        Class : {isFaculty ? assignments[0]?.assignedClassNode : 'B.E.ECE/01/A'}
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Period 1<br/><span className="text-muted text-sm">8:30 - 9:20</span></th>
              <th>Period 2<br/><span className="text-muted text-sm">9:20 - 10:10</span></th>
              <th>Period 3<br/><span className="text-muted text-sm">10:10 - 11:00</span></th>
              <th>Period 4<br/><span className="text-muted text-sm">11:00 - 11:50</span></th>
              <th>Period 5<br/><span className="text-muted text-sm">12:40 - 1:30</span></th>
              <th>Period 6<br/><span className="text-muted text-sm">1:30 - 2:20</span></th>
              <th>Period 7<br/><span className="text-muted text-sm">2:20 - 3:10</span></th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, idx) => (
              <tr key={idx}>
                <td className="font-bold">{row.day}</td>
                <td>{row.p1}</td>
                <td>{row.p2}</td>
                <td>{row.p3}</td>
                <td style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-muted)' }}>{row.p4}</td>
                <td>{row.p5}</td>
                <td>{row.p6}</td>
                <td>{row.p7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimeTableView;
