import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

function LeaveView({ user }) {
  const [type, setType]         = useState('leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate]     = useState('');
  const [reason, setReason]     = useState('');
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const fetchHistory = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false });
    if (error) { console.error('fetchHistory:', error.message); return; }
    setHistory(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('leave_requests').insert([{
      user_id:      user.id,
      name:         `${user.name} (${user.id})`,
      type,
      from_date:    fromDate,
      to_date:      toDate,
      dates:        `${fromDate} to ${toDate}`,
      reason,
      status:       'Pending',
      submitted_at: new Date().toISOString(),
    }]);

    if (error) {
      alert('Failed to submit: ' + error.message);
    } else {
      alert('Request submitted successfully!');
      setFromDate('');
      setToDate('');
      setReason('');
      await fetchHistory();
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Leave / OD Form</h2>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        <div className="input-group">
          <label>Leave Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="leave">Apply for Leave</option>
            <option value="od">Apply for OD</option>
          </select>
        </div>

        <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
          </div>
        </div>

        <div className="input-group">
          <label>Reason</label>
          <textarea rows="4" value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Type your reason here..."></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>My Applications History</h3>

        {history.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
            <p className="text-muted">You have no past leave or OD applications.</p>
          </div>
        ) : (
          <div className="table-container card">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(req => (
                  <tr key={req.id}>
                    <td>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: req.type === 'od' ? '#dbeafe' : '#fef3c7', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>
                        {req.type}
                      </span>
                    </td>
                    <td>{req.dates}</td>
                    <td className="text-muted" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.reason}</td>
                    <td>
                      <span style={{
                        padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: '600',
                        backgroundColor: req.status === 'Approved' ? '#dcfce7' : req.status === 'Declined' ? '#fee2e2' : '#f1f5f9',
                        color: req.status === 'Approved' ? '#166534' : req.status === 'Declined' ? '#991b1b' : '#475569'
                      }}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveView;
