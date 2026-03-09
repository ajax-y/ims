import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { AlertTriangle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const CalendarCard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await fetch('http://localhost:8000/admin/calendar', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          throw new Error('API down');
        }
      } catch(err) {
        console.warn('API down, using local mock calendar');
        setEvents([
          { date: new Date().toISOString(), event_name: 'Semester Start', description: 'Classes begin', is_holiday: false },
          { date: new Date(Date.now() + 86400000 * 15).toISOString(), event_name: 'Public Holiday', description: 'National Holiday', is_holiday: true }
        ]);
      }
      setLoading(false);
    };
    fetchCalendar();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Academic Calendar`, 14, 15);
    
    const tableColumn = ["Date", "Event", "Description", "Holiday"];
    const tableRows = [];

    events.forEach(ev => {
      const d = new Date(ev.date).toLocaleDateString();
      tableRows.push([d, ev.event_name, ev.description || '-', ev.is_holiday ? 'Yes' : 'No']);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Academic_Calendar.pdf`);
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div className="mobile-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Academic Calendar</h3>
        {events.length > 0 && (
          <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            <Download size={16} /> Download PDF
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="text-muted" style={{ padding: '2rem', textAlign: 'center' }}>Loading calendar...</div>
      ) : events.length === 0 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '150px',
          backgroundColor: 'var(--secondary)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)'
        }}>
          <p>No calendar events published yet.</p>
        </div>
      ) : (
        <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr><th>Date</th><th>Event</th><th>Description</th><th>Holiday</th></tr>
            </thead>
            <tbody>
              {events.map((ev, i) => (
                <tr key={i} style={ev.is_holiday ? { backgroundColor: '#fef2f2' } : {}}>
                  <td className="font-bold">{new Date(ev.date).toLocaleDateString()}</td>
                  <td>{ev.event_name}</td>
                  <td className="text-muted">{ev.description || '-'}</td>
                  <td>
                    {ev.is_holiday ? <span className="text-danger font-bold">Yes</span> : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function HomeView({ user }) {
  const { getCGPA, getStudentAttendanceStats, getSubjectsForStudent } = useData();
  const [realCgpa, setRealCgpa] = useState(0);

  useEffect(() => {
    // Only fetch for students
    if (user?.role !== 'student') return;
    const fetchResults = async () => {
      try {
        const res = await fetch('http://localhost:8000/admin/results/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            let totalCredits = 0;
            let totalPoints = 0;
            data.forEach(sem => {
              totalCredits += sem.total_credits;
              totalPoints += (sem.gpa * sem.total_credits);
            });
            const cgpaVal = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
            setRealCgpa(cgpaVal);
          }
        }
      } catch (err) {
        console.error("Failed to fetch results", err);
      }
    };
    fetchResults();
  }, [user]);

  // Fallback to old mock calculation if no real DB results exist
  const displayCgpa = realCgpa > 0 ? realCgpa : getCGPA(user?.id);
  const mySubjects = getSubjectsForStudent(user?.department);
  const attStats = getStudentAttendanceStats(user?.id);
  
  const hasClasses = mySubjects.length > 0;
  const hasAttendanceData = hasClasses && attStats.completedPeriods > 0;

  const attPerc = hasAttendanceData 
    ? Math.round((attStats.attendedPeriods / attStats.completedPeriods) * 100)
    : 0;

  const leavesTaken = hasAttendanceData 
    ? (attStats.completedPeriods - attStats.attendedPeriods)
    : 0;

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

      <div className="grid-responsive" style={{
        marginTop: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Blue Progress Ring - CGPA */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
            Current CGPA {realCgpa > 0 && <LiveIcon />}
          </p>
          <div className="progress-ring" style={{ '--progress': `${(displayCgpa / 10) * 100}%` }}>
            <span className="progress-ring-text">{displayCgpa}</span>
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
          <div className={`progress-ring ${!hasAttendanceData ? 'default-ring' : ''}`} style={hasAttendanceData ? { '--progress': `${attPerc}%` } : {}}>
            <span className="progress-ring-text" style={!hasAttendanceData ? { color: 'var(--text-muted)' } : {}}>
              {hasAttendanceData ? `${attPerc}%` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Taken Leave */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500' }}>
            Taken Leave <LiveIcon />
          </p>
          <div className="progress-ring default-ring" style={hasAttendanceData ? { '--progress': '100%', '--ring-color': 'var(--danger)' } : {}}>
            <span className="progress-ring-text" style={{ color: hasAttendanceData ? 'var(--danger)' : 'var(--text-muted)' }}>
              {hasAttendanceData ? leavesTaken : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <CalendarCard />
    </div>
  );
}

export default HomeView;
