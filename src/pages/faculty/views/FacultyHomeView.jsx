import React from 'react';

const CalendarCard = () => (
  <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
      Academic Calendar
    </h3>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      backgroundColor: 'var(--secondary)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-muted)'
    }}>
      <p>Academic Calendar 2025 - Published by Admin</p>
    </div>
  </div>
);

function FacultyHomeView({ user }) {
  const classes = [
    { id: 1, year: '01', branch: 'B.E.ECE/A', attend: 88 },
    { id: 2, year: '02', branch: 'B.E.CSE/B', attend: 92 },
    { id: 3, year: '01', branch: 'B.Tech.IT/A', attend: 84 },
  ];

  return (
    <div>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hi, welcome back!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here are the classes you are assigned to.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {classes.map(cls => (
          <div key={cls.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>
              Year: {cls.year}
            </h3>
            <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>Class: {cls.branch}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Average Attendance</span>
              <span className="font-bold text-success" style={{ fontSize: '1.25rem' }}>{cls.attend}%</span>
            </div>
          </div>
        ))}
      </div>

      <CalendarCard />
    </div>
  );
}

export default FacultyHomeView;
