import React, { useState } from 'react';

export const AdminHomeView = () => (
  <div>
    <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>Admin Dashboard</h2>
    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>College Statistics Overview</p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--primary)' }}>
        <p className="text-muted">Total Students</p>
        <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>1,240</h3>
        <p className="text-sm">Year 1: 340 | Year 2: 300 | Year 3: 310 | Year 4: 290</p>
      </div>
      <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--success)' }}>
        <p className="text-muted">Teaching Staff</p>
        <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>145</h3>
      </div>
      <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--warning)' }}>
        <p className="text-muted">Non-Teaching Staff</p>
        <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>68</h3>
      </div>
    </div>

    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Academic Calendar</h3>
      <div className="input-group">
        <label>Upload New Calendar (PDF)</label>
        <input type="file" accept=".pdf" />
      </div>
      <button className="btn btn-primary" onClick={() => alert('Calendar Uploaded to all dashboards!')}>
        Upload and Publish
      </button>
    </div>
  </div>
);

export const TimetableUploadView = ({ type }) => {
  const isStudent = type === 'student';

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        Upload {isStudent ? 'Student' : 'Faculty'} Time Table
      </h2>
      <div className="input-group">
        {isStudent ? (
          <>
            <label>Select Year</label>
            <select><option>01</option><option>02</option><option>03</option><option>04</option></select>
            <label style={{marginTop: '1rem'}}>Select Class</label>
            <select><option>B.E.ECE/A</option><option>B.E.CSE/B</option></select>
          </>
        ) : (
          <>
            <label>Faculty Code / Name</label>
            <input type="text" placeholder="e.g. FAC001" />
          </>
        )}
      </div>
      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>Upload Time Table File (PDF/Excel)</label>
        <input type="file" />
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('Time Table Uploaded!')}>
        Upload Time Table
      </button>
    </div>
  );
};

export const ManageUsersView = ({ type }) => {
  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        Add New {type === 'student' ? 'Student' : 'Faculty'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" />
        </div>
        <div className="input-group">
          <label>IMS Login ID</label>
          <input type="text" placeholder={type === 'student' ? 'STU...' : 'FAC...'} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" />
        </div>
        <div className="input-group">
          <label>Department</label>
          <input type="text" />
        </div>
      </div>
      <button className="btn btn-success" style={{ backgroundColor: 'var(--success)', color: 'white', marginTop: '1rem', width: '100%' }} onClick={() => alert(`${type} Added Successfully!`)}>
        Add {type}
      </button>
    </div>
  );
};

export const ApprovalsView = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: 'Alice Smith (STU001)', type: 'Leave', dates: '12 Nov - 14 Nov', reason: 'Fever' },
    { id: 2, name: 'Dr. John (FAC012)', type: 'OD', dates: '15 Nov - 16 Nov', reason: 'Conference' },
  ]);

  const handleAction = (id, action) => {
    setRequests(requests.filter(req => req.id !== id));
    alert(`${action} successfully.`);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Leave / OD Approvals</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Name / ID</th><th>Type</th><th>Dates</th><th>Reason</th><th>Proofs</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted">No pending requests</td></tr>
            ) : requests.map(req => (
              <tr key={req.id}>
                <td className="font-bold">{req.name}</td>
                <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: req.type==='OD' ? '#dbeafe' : '#fef3c7', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>{req.type}</span></td>
                <td>{req.dates}</td>
                <td>{req.reason}</td>
                <td><a href="#" className="text-primary" style={{ textDecoration: 'underline' }}>View Proof</a></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--success)', color: 'white' }} onClick={() => handleAction(req.id, 'Approved')}>Approve</button>
                    <button className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--danger)', color: 'white' }} onClick={() => handleAction(req.id, 'Declined')}>Decline</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SemResultsView = () => {
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Manage Semester Results</h2>
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="input-group">
            <label>Select Year</label>
            <select><option>01</option><option>02</option><option>03</option><option>04</option></select>
          </div>
          <div className="input-group">
            <label>Select Class</label>
            <select><option>B.E.ECE/A</option></select>
          </div>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Reg No</th><th>Student Name</th><th>Overall Grade</th><th>Result</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-bold">STU001</td>
              <td>Alice Smith</td>
              <td>O</td>
              <td className="text-success font-bold">Pass</td>
              <td><button className="btn btn-primary" style={{ padding: '0.5rem' }}>Modify Results</button></td>
            </tr>
            <tr>
              <td className="font-bold">STU002</td>
              <td>Bob Johnson</td>
              <td>C</td>
              <td className="text-danger font-bold">Fail</td>
              <td><button className="btn btn-primary" style={{ padding: '0.5rem' }}>Modify Results</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
