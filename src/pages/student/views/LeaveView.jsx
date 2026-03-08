import React, { useState } from 'react';

function LeaveView({ user }) {
  const [type, setType] = useState('leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  
  // Custom hook to load students own history
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    const allReqs = JSON.parse(localStorage.getItem('ims_leave_requests') || '[]');
    setHistory(allReqs.filter(r => r.userId === user?.id));
  }, [user]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      name: user ? `${user.name} (${user.id})` : 'Unknown User',
      userId: user?.id || 'unknown',
      type: type,
      dates: `${fromDate} to ${toDate}`,
      reason: reason,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };
    const saved = JSON.parse(localStorage.getItem('ims_leave_requests') || '[]');
    const updatedReqs = [...saved, newReq];
    localStorage.setItem('ims_leave_requests', JSON.stringify(updatedReqs));
    setHistory(updatedReqs.filter(r => r.userId === user?.id));

    alert('Request submitted successfully!');
    setFromDate('');
    setToDate('');
    setReason('');
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

        <div className="input-group">
          <label>Upload Proof (png, jpg, jpeg, pdf - Max 2MB)</label>
          <input type="file" accept=".png,.jpg,.jpeg,.pdf" required />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Submit Request
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
                {history.reverse().map(req => (
                  <tr key={req.id}>
                    <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: req.type==='OD' || req.type==='od' ? '#dbeafe' : '#fef3c7', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{req.type}</span></td>
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
