import React, { useState, useEffect } from 'react';
import { UserCircle, Save, Edit2, Mail, Phone, MapPin, Droplet, HeartPulse } from 'lucide-react';
import { useUser } from '../context/UserContext';

const ProfileView = ({ user }) => {
  const { updateUserProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editable fields
  const [formData, setFormData] = useState({
    bio: user.bio || '',
    address: user.address || '',
    bloodGroup: user.bloodGroup || '',
    emergencyContact: user.emergencyContact || ''
  });

  // Keep synced if user prop changes
  useEffect(() => {
    setFormData({
      bio: user.bio || '',
      address: user.address || '',
      bloodGroup: user.bloodGroup || '',
      emergencyContact: user.emergencyContact || ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (updateUserProfile) {
      updateUserProfile(user.id, formData);
      alert("Profile updated successfully.");
    } else {
      alert("User context update function missing!");
    }
    setIsEditing(false);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>My Profile</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Edit2 size={16} /> Edit Details
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10b981' }}
          >
            <Save size={16} /> Save Changes
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Left Column - Read Only Admin Data */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            backgroundColor: 'var(--bg-color)', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
            color: 'var(--primary)', border: '4px solid var(--border)'
          }}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <UserCircle size={64} />
            )}
          </div>
          
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{user.name}</h3>
          <p className="text-muted" style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1.5rem' }}>
            {user.role} • {user.id}
          </p>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <Mail size={14} /> Email Address (Read-Only)
              </div>
              <div style={{ fontWeight: '500' }}>{user.email || 'Not Provided'}</div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <Phone size={14} /> Mobile Number (Read-Only)
              </div>
              <div style={{ fontWeight: '500' }}>{user.mobileNumber || 'Not Provided'}</div>
            </div>
            
            {user.classInfo && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <MapPin size={14} /> Class Info (Read-Only)
                </div>
                <div style={{ fontWeight: '500' }}>{user.classInfo}</div>
              </div>
            )}
            
            <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem', textAlign: 'center' }}>
              These fields are set by the Administrator. Contact the front desk to change them.
            </p>
          </div>
        </div>

        {/* Right Column - Editable Data */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Personal Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Bio / About Me</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us a little about yourself..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Residential Address</label>
              <textarea 
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Full residential address..."
                rows={2}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(200px, 1fr)', gap: '1.5rem' }}>
              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Droplet size={16} className="text-danger" /> Blood Group</label>
                <select 
                  name="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HeartPulse size={16} /> Emergency Contact</label>
                <input 
                  type="text" 
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Parent/Guardian Number"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;
