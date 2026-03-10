import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';
import { DollarSign, Book, GraduationCap, Download } from 'lucide-react';

export const StudentFeeView = ({ user }) => {
  const [fees, setFees] = useState([]);
  
  useEffect(() => {
    const fetchFees = async () => {
      const { data } = await supabase.from('fees').select('*').eq('student_id', user.id);
      setFees(data || []);
    };
    fetchFees();
  }, [user.id]);

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>My Fee Dues</h2>
      <div className="grid-responsive">
        {fees.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}><p>No fee records found.</p></div>
        ) : (
          fees.map(f => (
            <div key={f.id} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${f.status === 'Paid' ? 'var(--success)' : 'var(--danger)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: '600' }}>{f.type}</h3>
                  <p className="text-muted">Due: {new Date(f.due_date).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700' }}>₹{f.amount.toLocaleString()}</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: f.status === 'Paid' ? 'var(--success)' : 'var(--danger)' }}>{f.status.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const StudentLibraryView = ({ user }) => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      const { data } = await supabase.from('library_transactions').select('*, books(title, author)').eq('user_id', user.id);
      setLoans(data || []);
    };
    fetchLoans();
  }, [user.id]);

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>My Library Loans</h2>
      <div className="table-container">
        <table>
          <thead><tr><th>Book Title</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {loans.length === 0 ? (
              <tr><td colSpan="4" className="text-center text-muted">You have no active loans.</td></tr>
            ) : loans.map(l => (
              <tr key={l.id}>
                <td className="font-bold">{l.books?.title}</td>
                <td>{new Date(l.issue_date).toLocaleDateString()}</td>
                <td>{new Date(l.due_date).toLocaleDateString()}</td>
                <td><span style={{ color: l.status === 'Issued' ? 'var(--warning)' : 'var(--success)' }}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const StudentExamView = ({ user }) => {
  const [schedule, setSchedule] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data } = await supabase.from('exam_schedules').select('*, exams(name, type)');
      setSchedule(data || []);
    };
    fetchSchedule();
  }, []);

  const downloadHallTicket = () => {
    showToast('Hall ticket generation started. Standard institution PDF template will be generated...', 'info');
    // In a real implementation, we could use jspdf here.
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Exams & Hall Ticket</h2>
        <button className="btn btn-primary" onClick={downloadHallTicket}>
          <Download size={18} style={{ marginRight: '0.5rem' }} /> Hall Ticket
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Upcoming Exam Schedule</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Exam</th><th>Subject</th><th>Date</th><th>Room</th></tr></thead>
            <tbody>
              {schedule.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-muted">No exams scheduled.</td></tr>
              ) : schedule.map(s => (
                <tr key={s.id}>
                  <td>{s.exams?.name} ({s.exams?.type})</td>
                  <td className="font-bold">{s.subject}</td>
                  <td>{new Date(s.date).toLocaleDateString()} at {s.time}</td>
                  <td>{s.room}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
