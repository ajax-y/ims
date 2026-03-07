import React from 'react';

const schedule = [
  { day: 'Monday', p1: 'CS101', p2: 'CS102', p3: 'MA101', p4: 'Break', p5: 'PH101', p6: 'PH101 Lab', p7: 'GE101' },
  { day: 'Tuesday', p1: 'MA101', p2: 'CS101', p3: 'PH101', p4: 'Break', p5: 'CS102', p6: 'GE101', p7: 'Library' },
  { day: 'Wednesday', p1: 'CS102', p2: 'PH101', p3: 'CS101', p4: 'Break', p5: 'MA101', p6: 'Sports', p7: 'Sports' },
  { day: 'Thursday', p1: 'PH101 Lab', p2: 'PH101 Lab', p3: 'GE101', p4: 'Break', p5: 'CS101', p6: 'MA101', p7: 'CS102' },
  { day: 'Friday', p1: 'MA101', p2: 'CS102', p3: 'CS101', p4: 'Break', p5: 'GE101', p6: 'Library', p7: 'Seminar' },
];

function TimeTableView() {
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
        Class : B.E.ECE/01/A
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
