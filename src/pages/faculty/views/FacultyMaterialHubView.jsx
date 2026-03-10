import React, { useState, useEffect } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { supabase } from '../../../lib/supabase';
import { FileUp, Trash2, File as FileIcon, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

const FacultyMaterialHubView = ({ user }) => {
  const { classes } = useClasses();
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('fetchMaterials:', error.message);
      showToast('Could not load materials. Please check Supabase configuration.', 'error');
    } else {
      setMaterials(data || []);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedClass || !subjectName || !file) {
      showToast('Please fill all fields and select a file.', 'warning');
      return;
    }

    setLoading(true);

    // Determine file type
    let fileType = 'document';
    if (file.type.includes('pdf'))   fileType = 'pdf';
    else if (file.type.includes('image')) fileType = 'image';
    else if (file.type.includes('video')) fileType = 'video';

    // Upload file to Supabase Storage
    const filePath = `materials/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) {
      showToast('File upload failed: ' + uploadError.message, 'error');
      setLoading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    const publicUrl = urlData?.publicUrl || '';

    // Save metadata to materials table
    const { error: insertError } = await supabase.from('materials').insert([{
      title:       file.name,
      description: subjectName,
      url:         publicUrl,
      file_path:   filePath,
      category:    selectedClass,
      file_type:   fileType,
      uploaded_by: user.id,
    }]);

    if (insertError) {
      showToast('Failed to save material: ' + insertError.message, 'error');
    } else {
      showToast('Material uploaded successfully!', 'success');
      setFile(null);
      setSubjectName('');
      e.target.reset();
      await fetchMaterials();
    }

    setLoading(false);
  };

  const handleDelete = async (material) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;

    // Delete from storage
    if (material.file_path) {
      await supabase.storage.from('materials').remove([material.file_path]);
    }

    // Delete from table
    const { error } = await supabase.from('materials').delete().eq('id', material.id);
    if (error) {
      showToast('Delete failed: ' + error.message, 'error');
      return;
    }
    setMaterials(prev => prev.filter(m => m.id !== material.id));
    showToast('Material deleted.', 'info');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} className="text-primary" />;
      case 'video': return <VideoIcon size={20} className="text-primary" />;
      case 'pdf':   return <FileIcon  size={20} className="text-primary" />;
      default:      return <FileIcon  size={20} className="text-muted" />;
    }
  };

  return (
    <div className="fade-in">
      <div className="mobile-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Material Hub</h2>
      </div>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Upload New Material</h3>
        <form onSubmit={handleUpload} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>

          <div className="input-group">
            <label>Select Target Class *</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} required>
              <option value="">-- Choose Class --</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Subject Name *</label>
            <input
              type="text"
              placeholder="e.g. Data Structures"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>File (PDF, Image, Video) *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*,video/*,.pdf"
              required
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
            >
              <FileUp size={18} />
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        </form>
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Your Uploaded Materials</h3>

      {materials.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-muted">You haven't uploaded any materials yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {materials.map(material => (
            <div key={material.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                {getIcon(material.file_type)}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {material.title}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{material.category}</span>
                  <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{material.description}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(material)}
                style={{
                  background: 'transparent', border: 'none', color: '#ef4444',
                  cursor: 'pointer', padding: '0.5rem', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Delete File"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyMaterialHubView;
