import React, { useState } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { useUser } from '../../../context/UserContext';

export const AdminHomeView = () => {
  const { getStats, clearAllUsersExceptSelf } = useUser();
  const stats = getStats();

  const handleClearAll = () => {
    if (window.confirm("WARNING: This will delete ALL users (except you), ALL attendance, and ALL marks safely from the system. Are you sure?")) {
      clearAllUsersExceptSelf('aden'); // Preserve default admin
      localStorage.removeItem('ims_marks');
      localStorage.removeItem('ims_attendance');
      alert("System Reset Successfully! All data has been cleared.");
      window.location.reload();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleClearAll}>
          ⚠️ Nuclear Reset (Clear All Data)
        </button>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>College Statistics Overview</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--primary)' }}>
          <p className="text-muted">Total Students</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.studentCount}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--success)' }}>
          <p className="text-muted">Teaching Staff</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.facultyCount}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--warning)' }}>
          <p className="text-muted">Admins</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.adminCount}</h3>
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
};

export const TimetableUploadView = ({ type }) => {
  const isStudent = type === 'student';
  const { classes } = useClasses();

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
            <select>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
  const { classes } = useClasses();
  const { addUser } = useUser();
  const [formData, setFormData] = useState({ name: '', id: '', password: '', department: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddUser = () => {
    if (!formData.name || !formData.id || !formData.password) return alert("Please fill all required fields");
    if (type === 'student' && !formData.department) return alert("Department/Class is required for students");

    const success = addUser({ ...formData, role: type });
    if (success) {
      alert(`${type} Added Successfully!`);
      setFormData({ name: '', id: '', password: '', department: '' });
    } else {
      alert(`User ID "${formData.id}" already exists!`);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        Add New {type === 'student' ? 'Student' : type === 'faculty' ? 'Faculty' : 'Admin'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>IMS Login ID</label>
          <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder={type === 'student' ? 'STU...' : 'FAC...'} />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="text" name="password" value={formData.password} onChange={handleChange} />
        </div>
        {type !== 'admin' && (
          <div className="input-group">
            <label>Department / Class</label>
            {type === 'student' ? (
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. CSE Dept" />
            )}
          </div>
        )}
      </div>
      <button className="btn btn-success" style={{ backgroundColor: 'var(--success)', color: 'white', marginTop: '1rem', width: '100%' }} onClick={handleAddUser}>
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
  const { classes } = useClasses();

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
            <select>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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

export const ManageClassesView = () => {
  const { classes, addClass, deleteClass } = useClasses();
  const [newClass, setNewClass] = useState('');

  const handleAdd = () => {
    if (newClass.trim()) {
      addClass(newClass.trim());
      setNewClass('');
      alert('Class Added Successfully!');
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Manage Classes</h2>
      <div className="input-group">
        <label>Add New Class</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="e.g. B.E.ECE/A or vlsi a" 
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Add</button>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Existing Classes</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {classes.map(c => (
            <li key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <span>{c}</span>
              <button 
                className="btn btn-danger" 
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                onClick={() => { if(window.confirm(`Delete class ${c}?`)) deleteClass(c); }}
              >
                Delete
              </button>
            </li>
          ))}
          {classes.length === 0 && <p className="text-muted">No classes added yet.</p>}
        </ul>
      </div>
    </div>
  );
};
