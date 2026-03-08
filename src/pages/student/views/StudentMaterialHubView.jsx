import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Download, File as FileIcon, Image as ImageIcon, Video as VideoIcon, Search } from 'lucide-react';

const StudentMaterialHubView = ({ user }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load materials from Supabase OR fallback to localStorage
  useEffect(() => {
    fetchMaterials();
  }, [user.classInfo]);

  const fetchMaterials = async () => {
    setLoading(true);
    const studentClassId = user.classInfo || user.department || '';

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/materials', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter(m => m.category === studentClassId);
        setMaterials(filtered);
      } else {
        throw new Error('API Error');
      }
    } catch (err) {
      console.warn('API down, using local mock materials');
      const allSaved = JSON.parse(localStorage.getItem('ims_mock_materials') || '[]');
      const filtered = allSaved.filter(m => m.category === studentClassId);
      setMaterials(filtered);
    }
    setLoading(false);
  };
  const getIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={24} className="text-primary" />;
      case 'video': return <VideoIcon size={24} className="text-primary" />;
      case 'pdf': return <FileIcon size={24} className="text-primary" />;
      default: return <FileIcon size={24} className="text-muted" />;
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Material Hub</h2>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>View and download materials assigned to your class ({user.classInfo})</p>
        </div>
        <div className="input-group" style={{ margin: 0, width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Search size={18} className="text-muted" style={{ marginRight: '0.75rem' }} />
          <input 
            type="text" 
            placeholder="Search materials by title or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }} className="text-muted">Loading materials...</div>
      ) : materials.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FileIcon size={48} className="text-muted" style={{ opacity: 0.5 }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>No Materials Found</h3>
            <p className="text-muted" style={{ marginTop: '0.25rem' }}>Your teachers haven't uploaded any files for {user.classInfo} yet.</p>
          </div>
        </div>
      ) : (
        <div className="grid-mobile-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {materials.filter(m => 
            (m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
            (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
          ).map(material => (
            <div key={material.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', transition: 'var(--transition)' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                {getIcon('pdf')}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {material.title}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span>Subject: <strong style={{ color: 'var(--text-color)' }}>{material.description}</strong></span>
                  <span>Uploaded by: Faculty ID {material.uploaded_by}</span>
                </div>
              </div>
              <a 
                href={material.url}
                target="_blank"
                rel="noreferrer"
                style={{ 
                  background: 'var(--primary)', border: 'none', color: 'white', 
                  cursor: 'pointer', padding: '0.6rem', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', flexShrink: 0
                }}
                title="Download / View"
              >
                <Download size={18} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMaterialHubView;
