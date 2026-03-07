import React from 'react';
import { useData } from '../../../context/DataContext';
import { AlertTriangle } from 'lucide-react';

const LiveIcon = () => (
  <span style={{
    display: 'inline-block',
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    marginLeft: '8px',
    boxShadow: '0 0 0 rgba(16, 185, 129, 0.4)',
    animation: 'pulse 2s infinite'
  }} title="Live Sync"></span>
);

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
  const { getCGPA, getStudentAttendanceStats } = useData();

  const cgpa = getCGPA(user?.id);
  const attStats = getStudentAttendanceStats(user?.id);
  
  const attPerc = attStats.completedPeriods > 0 
    ? Math.round((attStats.attendedPeriods / attStats.completedPeriods) * 100)
    : 0;

  const leavesTaken = attStats.completedPeriods - attStats.attendedPeriods;

  return (
    <div>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hi, welcome back!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Here is an overview of your academic stats.</p>

      {attStats.completedPeriods > 0 && attPerc < 75 && (
        <div style={{
          backgroundColor: '#fef2f2',
          borderLeft: '4px solid var(--danger)',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }} className="fade-in">
          <AlertTriangle color="var(--danger)" size={24} />
          <div>
            <h4 style={{ color: 'var(--danger)', fontWeight: '600', marginBottom: '0.25rem' }}>Low Attendance Warning</h4>
            <p style={{ color: '#b91c1c', fontSize: '0.9rem', margin: 0 }}>
              Your current attendance is <strong>{attPerc}%</strong>, which is below the mandatory 75% threshold. Please meet your class advisor immediately.
            </p>
          </div>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Blue Progress Ring - CGPA */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
            Current CGPA <LiveIcon />
          </p>
          <div className="progress-ring" style={{ '--progress': `${(cgpa / 10) * 100}%` }}>
            <span className="progress-ring-text">{cgpa}</span>
          </div>
        </div>

        {/* Yellow/Amber - Arrears */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
            Arrears in Hand
          </p>
          <div className="progress-ring default-ring">
            <span className="progress-ring-text" style={{ color: 'var(--warning)' }}>0</span>
          </div>
        </div>

        {/* Blue Progress Ring - Avg Attendance */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
            Average Attendance <LiveIcon />
          </p>
          <div className="progress-ring" style={{ '--progress': `${attPerc}%` }}>
            <span className="progress-ring-text">{attPerc}%</span>
          </div>
        </div>

        {/* Blue Progress Ring - Taken Leave */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
            Taken Leave <LiveIcon />
          </p>
          <div className="progress-ring default-ring" style={{ '--progress': '100%', '--ring-color': 'var(--danger)' }}>
            <span className="progress-ring-text" style={{ color: 'var(--danger)' }}>{leavesTaken}</span>
          </div>
        </div>
      </div>

      <CalendarCard />
    </div>
  );
}

export default HomeView;
