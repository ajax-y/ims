import React, { useState } from 'react';

function LeaveView() {
  const [type, setType] = useState('leave');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Request submitted successfully!');
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>From Date</label>
            <input type="date" required />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>To Date</label>
            <input type="date" required />
          </div>
        </div>

        <div className="input-group">
          <label>Reason</label>
          <textarea rows="4" required placeholder="Type your reason here..."></textarea>
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
