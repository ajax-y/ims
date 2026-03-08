import React from 'react';
import { useUser } from '../../../context/UserContext';
import { useData } from '../../../context/DataContext';
import { Info } from 'lucide-react';

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

function FacultyHomeView({ user }) {
  const { getStudentsByClass } = useUser();
  const { getStudentAttendanceStats, getAssignmentsForFaculty } = useData();

  const assignments = getAssignmentsForFaculty(user?.id);

  return (
    <div>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Hi, welcome back!</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Here are the classes you are assigned to.</p>

      {assignments.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
          <Info size={48} style={{ color: '#94a3b8', margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No Classes Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            You have not been assigned to any classes yet. Please contact the Admin for assignment scheduling.
          </p>
        </div>
      ) : (
        <div className="grid-mobile-1col" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {assignments.map(cls => {
            const classStudents = getStudentsByClass(cls.assignedClassNode);
            
            let totalCompleted = 0;
            let totalAttended = 0;

            classStudents.forEach(student => {
              const stats = getStudentAttendanceStats(student.id);
              totalCompleted += stats.completedPeriods;
              totalAttended += stats.attendedPeriods;
            });

            const attPerc = totalCompleted > 0 
              ? Math.round((totalAttended / totalCompleted) * 100)
              : 0;

            return (
              <div key={cls.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                  {cls.subject}
                </h3>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>Class: {cls.assignedClassNode}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    Average Attendance <LiveIcon />
                  </span>
                  <span className="font-bold text-success" style={{ fontSize: '1.25rem' }}>{attPerc}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CalendarCard />
    </div>
  );
}

export default FacultyHomeView;
