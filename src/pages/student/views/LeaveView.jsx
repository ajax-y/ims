import React, { useState } from 'react';

function LeaveView({ user }) {
  const [type, setType] = useState('leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      name: user ? `${user.name} (${user.id})` : 'Unknown User',
      type: type,
      dates: `${fromDate} to ${toDate}`,
      reason: reason
    };
    const saved = JSON.parse(localStorage.getItem('ims_leave_requests') || '[]');
    localStorage.setItem('ims_leave_requests', JSON.stringify([...saved, newReq]));

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
    </div>
  );
}

export default LeaveView;
