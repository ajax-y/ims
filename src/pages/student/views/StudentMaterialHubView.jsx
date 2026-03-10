import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Download, File as FileIcon, Image as ImageIcon, Video as VideoIcon, Search } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const StudentMaterialHubView = ({ user }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, [user.department]);

  const fetchMaterials = async () => {
    setLoading(true);
    const studentClass = user.classInfo || user.department || '';

    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('category', studentClass)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('fetchMaterials (student):', error.message);
      showToast('Could not load materials. Please contact admin.', 'error');
    } else {
      setMaterials(data || []);
    }
    setLoading(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={24} className="text-primary" />;
      case 'video': return <VideoIcon size={24} className="text-primary" />;
      case 'pdf':   return <FileIcon  size={24} className="text-primary" />;
      default:      return <FileIcon  size={24} className="text-muted" />;
    }
  };

  const filtered = materials.filter(m =>
    (m.title       && m.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Material Hub</h2>
          <p className="text-muted" style={{ marginTop: '0.25rem' }}>
            View and download materials assigned to your class ({user.classInfo || user.department})
          </p>
        </div>
        <div className="input-group" style={{ margin: 0, width: '100%', maxWidth: '400px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <Search size={18} className="text-muted" style={{ marginRight: '0.75rem' }} />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }} className="text-muted">Loading materials...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FileIcon size={48} className="text-muted" style={{ opacity: 0.5 }} />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>No Materials Found</h3>
            <p className="text-muted" style={{ marginTop: '0.25rem' }}>
              {searchQuery ? 'No results match your search.' : `Your teachers haven't uploaded any files yet.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid-mobile-1col" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(material => (
            <div key={material.id} className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center', transition: 'var(--transition)' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                {getIcon(material.file_type)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {material.title}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span>Subject: <strong style={{ color: 'var(--text-main)' }}>{material.description}</strong></span>
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
