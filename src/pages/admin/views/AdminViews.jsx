import React, { useState, useEffect } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { useUser } from '../../../context/UserContext';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../context/ToastContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { hashPassword } from '../../../lib/crypto';
import Pagination from '../../../components/Pagination';
// Dynamic import used below to prevent crash if dependency is missing

export const AdminHomeView = () => {
  const { getStats, clearAllUsersExceptSelf } = useUser();
  const { showToast } = useToast();
  const [feeRecords, setFeeRecords] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch data for management dashboard
    const fetchData = async () => {
      const { data: fees } = await supabase.from('fees').select('amount, status');
      const { data: bks } = await supabase.from('books').select('available_copies, copies');
      setFeeRecords(fees || []);
      setBooks(bks || []);
    };
    fetchData();

    setChartData([
      { name: 'B.E.CSE', attendance: 85, fees: 75 },
      { name: 'B.E.ECE', attendance: 78, fees: 60 },
      { name: 'B.TECH.IT', attendance: 92, fees: 85 },
      { name: 'B.E.MECH', attendance: 65, fees: 40 },
    ]);
  }, []);

  // Use dynamic import for recharts to avoid crash if not installed
  const [Recharts, setRecharts] = useState(null);
  useEffect(() => {
    import('recharts').then(mod => setRecharts(mod)).catch(err => console.warn('Recharts not available'));
  }, []);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const stats = getStats();
  
  const handleUpload = async () => {
    if (!file) { showToast('Please select a file first.', 'warning'); return; }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await import('xlsx');
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        const { error } = await supabase.from('calendar_events').insert(jsonData.map(row => ({
          date: row.date,
          event_name: row.event_name,
          description: row.description,
          is_holiday: row.is_holiday === 'TRUE' || row.is_holiday === true
        })));
        
        if (error) throw error;
        showToast('Academic calendar updated successfully!', 'success');
        setFile(null);
      } catch (err) {
        showToast('Upload failed: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <div className="mobile-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2 className="mobile-header-text" style={{ fontSize: '1.875rem', fontWeight: '700' }}>Admin Dashboard</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>College Statistics Overview</p>

      <div className="grid-responsive" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--primary)' }}>
          <p className="text-muted">Total Students</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.studentCount}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--success)' }}>
          <p className="text-muted">Teaching Staff</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>{stats.facultyCount}</h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--warning)' }}>
          <p className="text-muted">Total Dues (Fees)</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            ₹{feeRecords.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0).toLocaleString()}
          </h3>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--orange)' }}>
          <p className="text-muted">Library Available</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700' }}>
            {books.reduce((acc, b) => acc + (b.available_copies || 0), 0)}
          </h3>
        </div>
      </div>

      {Recharts && (
        <div className="card" style={{ padding: '2rem', marginTop: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Average Attendance by Class (%)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={chartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <Recharts.XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Recharts.YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Recharts.Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: '600' }}
                />
                <Recharts.Bar dataKey="attendance" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </div>
        </div>
      )}

      {Recharts && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Fee Collection Overview (%)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <Recharts.ResponsiveContainer width="100%" height="100%">
              <Recharts.BarChart data={chartData}>
                <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <Recharts.XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Recharts.YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Recharts.Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', borderRadius: 'var(--radius-md)' }}
                  itemStyle={{ color: 'var(--success)', fontWeight: '600' }}
                />
                <Recharts.Bar dataKey="fees" fill="var(--success)" radius={[4, 4, 0, 0]} barSize={40} />
              </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
          </div>
        </div>
      )}

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
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) { showToast('Please select a file first.', 'warning'); return; }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await import('xlsx');
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        const { error } = await supabase.from('timetable_entries').insert(jsonData.map(row => ({
          day_of_week: row.day_of_week,
          class_id: row.class_id,
          period_number: parseInt(row.period_number),
          subject_name: row.subject_name,
          faculty_id: row.faculty_id,
          room_number: row.room_number?.toString()
        })));
        
        if (error) throw error;
        showToast('Timetable updated successfully!', 'success');
        setFile(null);
      } catch (err) {
        showToast('Upload failed: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="card mobile-p-1" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
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
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [formData, setFormData] = useState({ 
    name: '', id: '', password: '', department: '', email: '', mobileNumber: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  // Password reset
  const [resetUserId, setResetUserId] = useState(null);
  const [resetPwd, setResetPwd] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const filteredUsers = users.filter(u => u.role === type);
  const pagedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleResetPassword = async () => {
    if (!resetPwd.trim()) { showToast('Enter a new password.', 'warning'); return; }
    setResetLoading(true);
    const hashed = await hashPassword(resetPwd);
    const { error } = await supabase.from('users').update({ password_hash: hashed }).eq('id', resetUserId);
    setResetLoading(false);
    if (error) { showToast('Reset failed: ' + error.message, 'error'); return; }
    showToast('Password reset successfully!', 'success');
    setResetUserId(null);
    setResetPwd('');
  };

  const handleAddUser = async () => {
    if (type === 'student' && !formData.department) {
      showToast('Department/Class is required for students.', 'warning');
      return;
    }

    if (isEditing) {
      await updateUserProfile(formData.id, { ...formData, role: type });
      showToast(`${type} details updated successfully!`, 'success');
      setFormData({ name: '', id: '', password: '', department: '', email: '', mobileNumber: '' });
      setIsEditing(false);
    } else {
      const success = await addUser({ ...formData, role: type });
      if (success) {
        showToast(`${type} added successfully!`, 'success');
        setFormData({ name: '', id: '', password: '', department: '', email: '', mobileNumber: '' });
      } else {
        showToast(`User ID "${formData.id}" already exists!`, 'error');
      }
    }
  };

  const cancelEdit = () => {
    setFormData({ name: '', id: '', password: '', department: '', email: '', mobileNumber: '' });
    setIsEditing(false);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) { showToast('Please select a file first.', 'warning'); return; }
    setBulkLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await import('xlsx');
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        // Hash each password before inserting (security fix)
        const usersToInsert = await Promise.all(jsonData.map(async row => ({
          id: row.username || row.id,
          name: row.name,
          role: row.role,
          department: row.department || null,
          password_hash: await hashPassword(row.password || row.password_hash || ''),
        })));
        
        const { error } = await supabase.from('users').insert(usersToInsert);
        if (error) throw error;
        
        showToast(`Successfully imported ${usersToInsert.length} users!`, 'success');
        setBulkFile(null);
      } catch (err) {
        showToast('Upload failed: ' + err.message, 'error');
      } finally {
        setBulkLoading(false);
      }
    };
    reader.readAsArrayBuffer(bulkFile);
  };

  return (
    <div className="card mobile-p-1" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
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
                pagedUsers.map(u => (
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
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', backgroundColor: '#f59e0b', color: 'white' }}
                          onClick={() => { setResetUserId(u.id); setResetPwd(''); }}
                        >
                          Reset Pwd
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          onClick={async () => {
                            const ok = await confirm(`This will permanently delete ${u.name}'s account.`, `Delete ${u.name}?`);
                            if (ok) deleteUser(u.id);
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
          {/* Pagination */}
          <Pagination total={filteredUsers.length} page={page} pageSize={PAGE_SIZE} onChange={setPage} />
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetUserId && (
        <div
          onClick={() => setResetUserId(null)}
          style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.45)', zIndex:99998, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
        >
          <div onClick={e => e.stopPropagation()} className="fade-in" style={{ backgroundColor:'var(--card-bg)', borderRadius:'var(--radius-lg)', boxShadow:'0 20px 60px rgba(0,0,0,0.3)', padding:'2rem', width:'100%', maxWidth:'380px', border:'1px solid var(--border)' }}>
            <h3 style={{ fontSize:'1.1rem', fontWeight:'700', marginBottom:'1rem' }}>Reset Password</h3>
            <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'1rem' }}>Setting new password for: <strong>{resetUserId}</strong></p>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" value={resetPwd} onChange={e => setResetPwd(e.target.value)} placeholder="Enter new password" />
            </div>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
              <button onClick={() => setResetUserId(null)} style={{ padding:'0.6rem 1.25rem', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', background:'transparent', cursor:'pointer' }}>Cancel</button>
              <button onClick={handleResetPassword} disabled={resetLoading} style={{ padding:'0.6rem 1.25rem', border:'none', borderRadius:'var(--radius-md)', background:'var(--warning)', color:'white', cursor:'pointer', fontWeight:'600' }}>
                {resetLoading ? 'Saving...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ApprovalsView = () => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const { showToast } = useToast();

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) { console.error('fetchRequests:', error.message); return; }
    setRequests(data || []);
  };

  const handleAction = async (id, action) => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: action })
      .eq('id', id);
    if (error) { showToast('Action failed: ' + error.message, 'error'); return; }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    showToast(`Request ${action.toLowerCase()} successfully.`, 'success');
  };

  const pendingRequests  = requests.filter(r => !r.status || r.status === 'Pending');
  const historicRequests = requests.filter(r => r.status === 'Approved' || r.status === 'Declined');

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
  const { showToast } = useToast();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) { showToast('Please select a file first.', 'warning'); return; }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await import('xlsx');
        const ab = e.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        const { error } = await supabase.from('semester_results').insert(jsonData.map(row => ({
          student_id: row.student_username || row.student_id,
          semester: parseInt(row.semester),
          gpa: parseFloat(row.gpa),
          total_credits: parseInt(row.total_credits)
        })));
        
        if (error) throw error;
        showToast('Semester results updated successfully!', 'success');
        setFile(null);
      } catch (err) {
        showToast('Upload failed: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
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
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [newClass, setNewClass] = useState('');
  const [newDept, setNewDept] = useState('');

  const handleAddClass = () => {
    if (newClass.trim()) {
      addClass(newClass.trim());
      setNewClass('');
      showToast('Class added successfully!', 'success');
    }
  };

  const handleAddDept = () => {
    if (newDept.trim()) {
      addDepartment(newDept.trim().toUpperCase());
      setNewDept('');
      showToast('Department added successfully!', 'success');
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
                  onClick={async () => { if (await confirm(`Remove department "${d}"?`, 'Delete Department?')) deleteDepartment(d); }}
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
                  onClick={async () => { if (await confirm(`Remove class "${c}"?`, 'Delete Class?')) deleteClass(c); }}
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
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle]     = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();
  const confirm = useConfirm();

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('fetchAnnouncements:', error.message); return; }
    setAnnouncements(data || []);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !message) { showToast('Title and message are required.', 'warning'); return; }

    const { error } = await supabase
      .from('announcements')
      .insert([{ title, message }]);

    if (error) { showToast('Failed to post: ' + error.message, 'error'); return; }
    setTitle('');
    setMessage('');
    showToast('Announcement posted successfully!', 'success');
    await fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    if (!(await confirm('Are you sure you want to delete this announcement?', 'Delete Announcement?'))) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) { showToast('Delete failed: ' + error.message, 'error'); return; }
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Announcement deleted.', 'info');
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
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(a.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const FeeManagementView = () => {
  const { classes } = useClasses();
  const { showToast } = useToast();
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Assignment form
  const [assignClass, setAssignClass] = useState('');
  const [assignAmount, setAssignAmount] = useState('');
  const [feeType, setFeeType] = useState('Tuition Fee');

  useEffect(() => { fetchFeeRecords(); }, []);

  const fetchFeeRecords = async () => {
    const { data, error } = await supabase
      .from('fees')
      .select('*, users(name)')
      .order('due_date', { ascending: true });
    if (error) { console.error('fetchFees:', error.message); return; }
    setFeeRecords(data || []);
  };

  const handleAssignFee = async () => {
    if (!assignClass || !assignAmount) { showToast('Fill all assignment fields.', 'warning'); return; }
    setLoading(true);
    
    try {
      // 1. Get all students in that class
      const { data: students, error: sErr } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'student')
        .eq('department', assignClass);
      
      if (sErr) throw sErr;
      if (!students.length) { showToast('No students found in this class.', 'info'); setLoading(false); return; }

      // 2. Create fee records
      const newFees = students.map(s => ({
        student_id: s.id,
        amount: parseFloat(assignAmount),
        type: feeType,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'Pending'
      }));

      const { error: fErr } = await supabase.from('fees').insert(newFees);
      if (fErr) throw fErr;

      showToast(`Assigned ${feeType} to ${students.length} students.`, 'success');
      setAssignAmount('');
      await fetchFeeRecords();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (id) => {
    const { error } = await supabase.from('fees').update({ status: 'Paid' }).eq('id', id);
    if (error) { showToast('Update failed.', 'error'); return; }
    showToast('Payment recorded.', 'success');
    fetchFeeRecords();
  };

  const filtered = feeRecords.filter(f => 
    f.student_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.users?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Fee Management</h2>
      
      <div className="grid-responsive" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Assign Fee to Class</h3>
          <div className="input-group">
            <label>Select Class</label>
            <select value={assignClass} onChange={e => setAssignClass(e.target.value)}>
              <option value="">-- Choose Class --</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Fee Amount (₹)</label>
            <input type="number" value={assignAmount} onChange={e => setAssignAmount(e.target.value)} placeholder="0.00" />
          </div>
          <div className="input-group">
            <label>Fee Type</label>
            <select value={feeType} onChange={e => setFeeType(e.target.value)}>
              <option>Tuition Fee</option>
              <option>Bus Fee</option>
              <option>Exam Fee</option>
              <option>Hostel Fee</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAssignFee} disabled={loading}>
            {loading ? 'Processing...' : 'Assign Fee'}
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Total Pending</span>
              <span className="font-bold text-danger">₹{feeRecords.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Total Collected</span>
              <span className="font-bold text-success">₹{feeRecords.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div className="flex-mobile-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Student Fee Records</h3>
          <div className="input-group" style={{ margin: 0, width: '250px' }}>
            <input type="text" placeholder="Search Student ID/Name" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Reg No</th><th>Name</th><th>Type</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted">No records found.</td></tr>
              ) : filtered.map(f => (
                <tr key={f.id}>
                  <td className="font-bold">{f.student_id.toUpperCase()}</td>
                  <td>{f.users?.name || 'Unknown'}</td>
                  <td>{f.type}</td>
                  <td>₹{f.amount.toLocaleString()}</td>
                  <td>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600',
                      backgroundColor: f.status === 'Paid' ? '#dcfce7' : '#fee2e2',
                      color: f.status === 'Paid' ? '#166534' : '#991b1b'
                    }}>{f.status}</span>
                  </td>
                  <td>
                    {f.status === 'Pending' && (
                      <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: 'var(--success)', color: 'white' }} onClick={() => handleCollect(f.id)}>
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const LibraryView = () => {
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('catalog');

  // Book Form
  const [bookData, setBookData] = useState({ title: '', author: '', isbn: '', category: '', copies: 1 });
  // Issue Form
  const [issueData, setIssueData] = useState({ bookId: '', studentId: '', days: 14 });

  useEffect(() => { 
    fetchBooks();
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    const { data, error } = await supabase.from('books').select('*').order('title');
    if (error) console.error(error);
    else setBooks(data || []);
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase.from('library_transactions').select('*, books(title), users(name)').order('issue_date', { ascending: false });
    if (error) console.error(error);
    else setTransactions(data || []);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('books').insert([{
      ...bookData,
      available_copies: bookData.copies
    }]);
    setLoading(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Book added to library!', 'success');
      setBookData({ title: '', author: '', isbn: '', category: '', copies: 1 });
      fetchBooks();
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    const book = books.find(b => b.id === parseInt(issueData.bookId));
    if (!book || book.available_copies <= 0) { showToast('Selected book is out of stock.', 'warning'); return; }
    
    setLoading(true);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + parseInt(issueData.days));

      const { error: tErr } = await supabase.from('library_transactions').insert([{
        book_id: issueData.bookId,
        user_id: issueData.studentId,
        issue_date: new Date().toISOString(),
        due_date: dueDate.toISOString(),
        status: 'Issued'
      }]);
      if (tErr) throw tErr;

      const { error: bErr } = await supabase.from('books').update({ 
        available_copies: book.available_copies - 1 
      }).eq('id', book.id);
      if (bErr) throw bErr;

      showToast('Book issued successfully!', 'success');
      setIssueData({ bookId: '', studentId: '', days: 14 });
      fetchBooks();
      fetchTransactions();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (tx) => {
    const { error: tErr } = await supabase.from('library_transactions').update({ 
      status: 'Returned', 
      return_date: new Date().toISOString() 
    }).eq('id', tx.id);
    
    if (tErr) { showToast(tErr.message, 'error'); return; }

    const book = books.find(b => b.id === tx.book_id);
    if (book) {
      await supabase.from('books').update({ 
        available_copies: book.available_copies + 1 
      }).eq('id', book.id);
    }

    showToast('Book returned successfully.', 'success');
    fetchBooks();
    fetchTransactions();
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Library Management</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn" style={{ background: activeTab === 'catalog' ? 'var(--primary)' : 'transparent', color: activeTab === 'catalog' ? 'white' : 'var(--text-muted)' }} onClick={() => setActiveTab('catalog')}>Catalog</button>
        <button className="btn" style={{ background: activeTab === 'issue' ? 'var(--primary)' : 'transparent', color: activeTab === 'issue' ? 'white' : 'var(--text-muted)' }} onClick={() => setActiveTab('issue')}>Issue/Return</button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="grid-responsive">
          <form className="card" style={{ padding: '1.5rem' }} onSubmit={handleAddBook}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Add New Book</h3>
            <div className="input-group"><label>Title</label><input type="text" value={bookData.title} onChange={e => setBookData({...bookData, title: e.target.value})} required /></div>
            <div className="input-group"><label>Author</label><input type="text" value={bookData.author} onChange={e => setBookData({...bookData, author: e.target.value})} required /></div>
            <div className="input-group"><label>ISBN</label><input type="text" value={bookData.isbn} onChange={e => setBookData({...bookData, isbn: e.target.value})} /></div>
            <div className="input-group"><label>Total Copies</label><input type="number" value={bookData.copies} onChange={e => setBookData({...bookData, copies: parseInt(e.target.value)})} required /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>Register Book</button>
          </form>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Library Inventory</h3>
            <div className="table-container">
              <table>
                <thead><tr><th>Title</th><th>Available</th><th>Status</th></tr></thead>
                <tbody>
                  {books.map(b => (
                    <tr key={b.id}>
                      <td className="font-bold">{b.title}</td>
                      <td>{b.available_copies} / {b.copies}</td>
                      <td>{b.available_copies > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid-responsive">
          <form className="card" style={{ padding: '1.5rem' }} onSubmit={handleIssue}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Book Issuance</h3>
            <div className="input-group">
              <label>Select Book</label>
              <select value={issueData.bookId} onChange={e => setIssueData({...issueData, bookId: e.target.value})} required>
                <option value="">-- Choose Book --</option>
                {books.filter(b => b.available_copies > 0).map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </div>
            <div className="input-group"><label>Student ID</label><input type="text" value={issueData.studentId} onChange={e => setIssueData({...issueData, studentId: e.target.value})} required placeholder="STU..." /></div>
            <div className="input-group"><label>Issue Duration (Days)</label><input type="number" value={issueData.days} onChange={e => setIssueData({...issueData, days: e.target.value})} /></div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>Issue Book</button>
          </form>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Active Loans</h3>
            <div className="table-container">
              <table>
                <thead><tr><th>Book</th><th>Student</th><th>Due Date</th><th>Action</th></tr></thead>
                <tbody>
                  {transactions.filter(t => t.status === 'Issued').map(t => (
                    <tr key={t.id}>
                      <td>{t.books?.title}</td>
                      <td>{t.user_id}</td>
                      <td>{new Date(t.due_date).toLocaleDateString()}</td>
                      <td><button className="btn" style={{ padding: '0.2rem 0.5rem', backgroundColor: 'var(--success)', color: 'white', fontSize: '0.8rem' }} onClick={() => handleReturn(t)}>Return</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ExamCellView = () => {
  const { showToast } = useToast();
  const [exams, setExams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Exam Form
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState('Internal');
  // Schedule Form
  const [activeExamId, setActiveExamId] = useState('');
  const [schedData, setSchedData] = useState({ subject: '', date: '', time: '10:00 AM', room: '' });

  useEffect(() => {
    fetchExams();
    fetchSchedules();
  }, []);

  const fetchExams = async () => {
    const { data } = await supabase.from('exams').select('*').order('start_date', { ascending: false });
    setExams(data || []);
  };

  const fetchSchedules = async () => {
    const { data } = await supabase.from('exam_schedules').select('*, exams(name)');
    setSchedules(data || []);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('exams').insert([{ name: examName, type: examType, start_date: new Date().toISOString() }]);
    setLoading(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Exam created!', 'success');
      setExamName('');
      fetchExams();
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!activeExamId) { showToast('Select an exam first.', 'warning'); return; }
    setLoading(true);
    const { error } = await supabase.from('exam_schedules').insert([{ ...schedData, exam_id: activeExamId }]);
    setLoading(false);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Schedule added!', 'success');
      setSchedData({ subject: '', date: '', time: '10:00 AM', room: '' });
      fetchSchedules();
    }
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Examination Cell</h2>
      
      <div className="grid-responsive" style={{ marginBottom: '2rem' }}>
        <form className="card" style={{ padding: '1.5rem' }} onSubmit={handleCreateExam}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Initiate New Exam</h3>
          <div className="input-group"><label>Exam Name</label><input type="text" value={examName} onChange={e => setExamName(e.target.value)} placeholder="e.g. Semester Nov 2024" required /></div>
          <div className="input-group">
            <label>Type</label>
            <select value={examType} onChange={e => setExamType(e.target.value)}>
              <option>Internal</option>
              <option>Semester</option>
              <option>Practical</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>Create Exam</button>
        </form>

        <form className="card" style={{ padding: '1.5rem' }} onSubmit={handleAddSchedule}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Define Schedule</h3>
          <div className="input-group">
            <label>Select Exam</label>
            <select value={activeExamId} onChange={e => setActiveExamId(e.target.value)} required>
              <option value="">-- Choose Exam --</option>
              {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Subject Code/Name</label><input type="text" value={schedData.subject} onChange={e => setSchedData({...schedData, subject: e.target.value})} required /></div>
          <div className="input-group"><label>Date</label><input type="date" value={schedData.date} onChange={e => setSchedData({...schedData, date: e.target.value})} required /></div>
          <div className="input-group"><label>Room No</label><input type="text" value={schedData.room} onChange={e => setSchedData({...schedData, room: e.target.value})} placeholder="e.g. EB 302" required /></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>Add to Schedule</button>
        </form>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Full Exam Timetable</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Exam</th><th>Subject</th><th>Date</th><th>Time</th><th>Room</th></tr></thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-muted">No schedules defined yet.</td></tr>
              ) : schedules.map(s => (
                <tr key={s.id}>
                  <td className="font-bold">{s.exams?.name}</td>
                  <td>{s.subject}</td>
                  <td>{new Date(s.date).toLocaleDateString()}</td>
                  <td>{s.time}</td>
                  <td><span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{s.room}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
