import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import { useClasses } from '../../../context/ClassContext';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

function FacultyAssignmentView() {
  const { users } = useUser();
  const { classes } = useClasses();
  const { assignClassToFaculty, facultyAssignments } = useData();
  const { showToast } = useToast();

  const facultyMembers = users.filter(u => u.role === 'faculty');

  const [formData, setFormData] = useState({
    facultyId: '',
    year: '01',
    department: 'B.E.ECE',
    section: 'A',
    subject: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.facultyId || !formData.subject) {
      showToast('Please fill in Faculty and Subject fields.', 'warning');
      return;
    }

    const assignment = {
      ...formData,
      assignedClassNode: `${formData.department}/${formData.year}/${formData.section}`
    };

    assignClassToFaculty(assignment);
    showToast('Faculty assignment saved successfully!', 'success');
    setFormData({ ...formData, subject: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
          <UserPlus size={24} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Faculty Class Assignment</h2>
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          
          <div className="input-group">
            <label>Select Faculty <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select name="facultyId" value={formData.facultyId} onChange={handleChange}>
              <option value="">-- Choose Faculty --</option>
              {facultyMembers.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Year</label>
            <select name="year" value={formData.year} onChange={handleChange}>
              <option value="01">01 (1st Year)</option>
              <option value="02">02 (2nd Year)</option>
              <option value="03">03 (3rd Year)</option>
              <option value="04">04 (4th Year)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="B.E.ECE">B.E.ECE</option>
              <option value="B.E.CSE">B.E.CSE</option>
              <option value="B.Tech.IT">B.Tech.IT</option>
              <option value="B.E.MECH">B.E.MECH</option>
            </select>
          </div>

          <div className="input-group">
            <label>Section</label>
            <select name="section" value={formData.section} onChange={handleChange}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div className="input-group">
            <label>Subject / Course Name <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input 
              type="text" 
              name="subject" 
              placeholder="e.g. Data Structures" 
              value={formData.subject} 
              onChange={handleChange} 
            />
          </div>

        </div>

        <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '1.5rem', width: '100%' }}>
          <UserPlus size={18} style={{ marginRight: '0.5rem' }} />
          Assign to Faculty
        </button>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>
        Current Assignments Overview
      </h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Year</th>
              <th>Department</th>
              <th>Section</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {facultyAssignments.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted">No assignments created yet.</td></tr>
            ) : (
              facultyAssignments.map(a => {
                const f = facultyMembers.find(fm => fm.id === a.facultyId);
                return (
                  <tr key={a.id}>
                    <td className="font-bold">{f ? f.name : a.facultyId}</td>
                    <td>{a.year}</td>
                    <td>{a.department}</td>
                    <td>{a.section}</td>
                    <td>{a.subject}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default FacultyAssignmentView;
