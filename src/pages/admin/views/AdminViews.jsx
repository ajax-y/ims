import React, { useState } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { useUser } from '../../../context/UserContext';

export const AdminHomeView = () => {
  const { getStats, clearAllUsersExceptSelf } = useUser();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file.");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:8000/admin/upload/calendar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setFile(null);
      } else {
        alert(data.detail || "Upload failed");
      }
    } catch(err) {
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="mobile-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
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
        <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem'}}>Upload Excel format. Columns: date, event_name, description, is_holiday</p>
        <div className="input-group">
          <label>Upload New Calendar (.xlsx)</label>
          <input type="file" accept=".xlsx, .xls" onChange={e => setFile(e.target.files[0])} />
        </div>
        <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload and Publish'}
        </button>
      </div>
    </div>
  );
};

export const TimetableUploadView = ({ type }) => {
  const isStudent = type === 'student';
  const { classes } = useClasses();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file.");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:8000/admin/upload/timetable', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setFile(null);
      } else {
        alert(data.detail || "Upload failed");
      }
    } catch(err) {
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
        Upload {isStudent ? 'Student' : 'Faculty'} Time Table
      </h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem'}}>
        Upload Excel format. Columns: day_of_week, class_id, period_number, subject_name, faculty_id, room_number
      </p>
      
      <div className="input-group" style={{ marginTop: '1rem' }}>
        <label>Upload Time Table File (.xlsx)</label>
        <input type="file" accept=".xlsx, .xls" onChange={e => setFile(e.target.files[0])} />
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Time Table'}
      </button>
    </div>
  );
};

export const ManageUsersView = ({ type }) => {
  const { classes, departments } = useClasses();
  const { addUser, users, deleteUser, updateUserProfile } = useUser();
  const [formData, setFormData] = useState({ 
    name: '', id: '', password: '', department: '', email: '', mobileNumber: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const filteredUsers = users.filter(u => u.role === type);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddUser = async () => {
    if (type === 'student' && !formData.department) return alert("Department/Class is required for students");

    if (isEditing) {
      await updateUserProfile(formData.id, { ...formData, role: type });
      alert(`${type} Details Updated Successfully!`);
      setFormData({ name: '', id: '', password: '', department: '', email: '', mobileNumber: '' });
      setIsEditing(false);
    } else {
      const success = await addUser({ ...formData, role: type });
      if (success) {
        alert(`${type} Added Successfully!`);
        setFormData({ name: '', id: '', password: '', department: '', email: '', mobileNumber: '' });
      } else {
        alert(`User ID "${formData.id}" already exists!`);
      }
    }
  };

  const cancelEdit = () => {
    setFormData({ name: '', id: '', password: '', department: '', email: '', mobileNumber: '' });
    setIsEditing(false);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return alert("Please select an Excel file for bulk upload.");
    setBulkLoading(true);
    const formData = new FormData();
    formData.append('file', bulkFile);
    
    try {
      const res = await fetch('http://localhost:8000/admin/upload/users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setBulkFile(null);
        // In a real app we'd refresh the user list from the backend here.
      } else {
        alert(data.detail || "Upload failed");
      }
    } catch(err) {
      alert("Upload failed: " + err.message);
    }
    setBulkLoading(false);
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
        {isEditing ? `Edit ${type} Details` : `Add New ${type === 'student' ? 'Student' : type === 'faculty' ? 'Faculty' : 'Admin'}`}
      </h2>
      <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Bulk Upload via Excel</h3>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          Columns needed: username, name, password, role, department, year, section
        </p>
        <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="input-group mobile-w-full" style={{ margin: 0, flex: 1 }}>
            <input type="file" accept=".xlsx, .xls" onChange={e => setBulkFile(e.target.files[0])} className="mobile-w-full" />
          </div>
          <button className="btn btn-primary mobile-w-full" onClick={handleBulkUpload} disabled={bulkLoading}>
            {bulkLoading ? 'Uploading...' : 'Import Users'}
          </button>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Manual Add / Edit</h3>
      <div className="grid-mobile-1col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label>IMS Login ID</label>
          <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder={type === 'student' ? 'STU...' : 'FAC...'} disabled={isEditing} />
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
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="">-- Select Dept --</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
          </div>
        )}
        <div className="input-group">
          <label>Email Address *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@rit.edu" required />
        </div>
        <div className="input-group">
          <label>Mobile Number *</label>
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="10-digit number" maxLength="10" required />
        </div>
      </div>
      <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn btn-success mobile-w-full" style={{ backgroundColor: 'var(--success)', color: 'white', flex: 1 }} onClick={handleAddUser}>
          {isEditing ? `Save Changes` : `Add ${type}`}
        </button>
        {isEditing && (
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={cancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Manage Existing {type}s</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Login ID</th>
                {type !== 'admin' && <th>Class / Dept</th>}
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={type === 'admin' ? 5 : 6} className="text-center text-muted">No {type}s found.</td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ color: 'var(--text-muted)' }}>{u.name.charAt(0).toUpperCase()}</div>
                        )}
                      </div>
                    </td>
                    <td className="font-bold">{u.name}</td>
                    <td><span style={{ fontFamily: 'monospace', backgroundColor: 'var(--bg-main)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{u.id}</span></td>
                    {type !== 'admin' && <td>{u.department || '-'}</td>}
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--text-muted)' }}>{u.email || '-'}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{u.mobileNumber || '-'}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          onClick={() => {
                            setFormData({
                              name: u.name || '',
                              id: u.id || '',
                              password: u.password || '',
                              department: u.department || '',
                              email: u.email || '',
                              mobileNumber: u.mobileNumber || ''
                            });
                            setIsEditing(true);
                            // Scroll to top of form
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${u.name}?`)) deleteUser(u.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const ApprovalsView = () => {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('ims_leave_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed parsing leave requests", e);
      }
    }
    return []; // Start empty unless applications exist
  });

  const handleAction = (id, action) => {
    const updated = requests.map(req => req.id === id ? { ...req, status: action } : req);
    setRequests(updated);
    localStorage.setItem('ims_leave_requests', JSON.stringify(updated));
    alert(`${action} successfully.`);
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending' || !r.status);
  const historicRequests = requests.filter(r => r.status === 'Approved' || r.status === 'Declined');

  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Leave / OD Approvals</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          className="btn" 
          style={{ padding: '0.5rem 1.5rem', fontWeight: '600', borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : 'none', color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingRequests.length})
        </button>
        <button 
          className="btn" 
          style={{ padding: '0.5rem 1.5rem', fontWeight: '600', borderBottom: activeTab === 'history' ? '2px solid var(--primary)' : 'none', color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)' }}
          onClick={() => setActiveTab('history')}
        >
          Actioned History
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>Name / ID</th><th>Type</th><th>Dates</th><th>Reason</th><th>Proofs</th><th>{activeTab === 'pending' ? 'Actions' : 'Status'}</th></tr>
          </thead>
          <tbody>
            {activeTab === 'pending' ? (
              pendingRequests.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">No pending requests</td></tr>
              ) : pendingRequests.map(req => (
                <tr key={req.id}>
                  <td className="font-bold">{req.name}</td>
                  <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: req.type==='OD' || req.type==='od' ? '#dbeafe' : '#fef3c7', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{req.type}</span></td>
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
              ))
            ) : (
              historicRequests.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">No actioned requests</td></tr>
              ) : historicRequests.reverse().map(req => (
                <tr key={req.id}>
                  <td className="font-bold">{req.name}</td>
                  <td><span style={{ padding: '0.25rem 0.5rem', backgroundColor: req.type==='OD' || req.type==='od' ? '#dbeafe' : '#fef3c7', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>{req.type}</span></td>
                  <td>{req.dates}</td>
                  <td>{req.reason}</td>
                  <td><a href="#" className="text-primary" style={{ textDecoration: 'underline' }}>View Proof</a></td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SemResultsView = () => {
  const { classes } = useClasses();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file.");
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:8000/admin/upload/results', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setFile(null);
      } else {
        alert(data.detail || "Upload failed");
      }
    } catch(err) {
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Manage Semester Results</h2>
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Results via Excel</h3>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
          Columns needed: student_username, semester, gpa, total_credits
        </p>
        <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="input-group mobile-w-full" style={{ margin: 0, flex: 1 }}>
            <input type="file" accept=".xlsx, .xls" onChange={e => setFile(e.target.files[0])} className="mobile-w-full" />
          </div>
          <button className="btn btn-primary mobile-w-full" onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Import Results'}
          </button>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Reg No</th><th>Student Name</th><th>Overall GPA</th><th>Semester</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="text-center text-muted">Results fetched dynamically from DB (placeholder)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ManageClassesView = () => {
  const { classes, addClass, deleteClass, departments, addDepartment, deleteDepartment } = useClasses();
  const [newClass, setNewClass] = useState('');
  const [newDept, setNewDept] = useState('');

  const handleAddClass = () => {
    if (newClass.trim()) {
      addClass(newClass.trim());
      setNewClass('');
      alert('Class Added Successfully!');
    }
  };

  const handleAddDept = () => {
    if (newDept.trim()) {
      addDepartment(newDept.trim().toUpperCase());
      setNewDept('');
      alert('Department Added Successfully!');
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Manage Departments & Classes</h2>
      
      {/* DEPARTMENTS SECTION */}
      <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Departments</h3>
        <div className="input-group">
          <label>Add New Department</label>
          <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="e.g. IT, BIOTECH" 
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddDept}>Add</button>
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Existing Departments</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {departments.map(d => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: '500' }}>
                {d}
                <button 
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
                  onClick={() => { if(window.confirm(`Delete department ${d}?`)) deleteDepartment(d); }}
                  title="Remove Department"
                >
                  ✕
                </button>
              </div>
            ))}
            {departments.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem' }}>No departments added yet.</p>}
          </div>
        </div>
      </div>

      {/* CLASSES SECTION */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Classes</h3>
        <div className="input-group">
          <label>Add New Class</label>
          <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="e.g. B.E.ECE/A" 
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddClass}>Add</button>
          </div>
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Existing Classes</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {classes.map(c => (
              <li key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.95rem' }}>
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
            {classes.length === 0 && <p className="text-muted" style={{ fontSize: '0.9rem' }}>No classes added yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ManageAnnouncementsView = () => {
  const [announcements, setAnnouncements] = useState(() => {
    return JSON.parse(localStorage.getItem('ims_announcements') || '[]');
  });
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (!title || !message) return alert("Title and message required");
    
    const newAnnouncement = {
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString()
    };
    const updated = [newAnnouncement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('ims_announcements', JSON.stringify(updated));
    setTitle('');
    setMessage('');
    alert("Announcement posted successfully!");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete announcement?")) return;
    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('ims_announcements', JSON.stringify(updated));
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Announcements</h2>
      
      <form className="card" onSubmit={handlePost} style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Post New Announcement</h3>
        <div className="input-group">
          <label>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Holiday Notice" />
        </div>
        <div className="input-group">
          <label>Message</label>
          <textarea rows="4" value={message} onChange={e => setMessage(e.target.value)} required placeholder="Type your announcement..."></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Announcement</button>
      </form>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Announcements</h3>
        {announcements.length === 0 ? (
          <p className="text-muted">No announcements posted.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map(a => (
              <div key={a.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: '600' }}>{a.title}</h4>
                  <button onClick={() => handleDelete(a.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{a.message}</p>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(a.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
