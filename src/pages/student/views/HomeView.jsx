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

function HomeView({ user }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hi, welcome back!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here is an overview of your academic stats.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Green - CGPA */}
        <div style={{ backgroundColor: 'var(--success)', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>Current CGPA</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>8.75</h3>
        </div>

        {/* Yellow/Amber - Arrears */}
        <div style={{ backgroundColor: 'var(--warning)', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>Arrears in Hand</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>0</h3>
        </div>

        {/* Orange - Avg Attendance */}
        <div style={{ backgroundColor: 'var(--orange)', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>Average Attendance</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>88%</h3>
        </div>

        {/* Red - Taken Leave */}
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '0.5rem' }}>Taken Leave</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>4</h3>
        </div>
      </div>

      <CalendarCard />
    </div>
  );
}

export default HomeView;
