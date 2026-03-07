import React, { useState, useEffect } from 'react';
import { useClasses } from '../../../context/ClassContext';
import { useUser } from '../../../context/UserContext';
import { supabase } from '../../../lib/supabase';
import { FileUp, Trash2, File as FileIcon, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';

const FacultyMaterialHubView = ({ user }) => {
  const { classes } = useClasses();
  const [selectedClass, setSelectedClass] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [file, setFile] = useState(null);
  
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load materials from Supabase OR fallback to localStorage
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('uploaded_by', user.id)
          .order('created_at', { ascending: false });
        if (!error && data) setMaterials(data);
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    } else {
      // Fallback
      const saved = JSON.parse(localStorage.getItem('ims_mock_materials') || '[]');
      setMaterials(saved.filter(m => m.uploaded_by === user.id));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedClass || !subjectName || !file) {
      alert("Please fill all fields and select a file.");
      return;
    }
    
    setLoading(true);
    let fileUrl = '';
    let fileType = 'unknown';

    // Basic type checking
    if (file.type.includes('pdf')) fileType = 'pdf';
    else if (file.type.includes('image')) fileType = 'image';
    else if (file.type.includes('video')) fileType = 'video';
    else fileType = 'document';

    if (supabase) {
      // 1. Upload to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('materials_bucket')
        .upload(fileName, file);
      
      if (storageError) {
        alert("Upload failed: " + storageError.message);
        setLoading(false);
        return;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('materials_bucket')
        .getPublicUrl(fileName);
        
      fileUrl = publicUrlData.publicUrl;

      // 2. Insert into database
      const newMaterial = {
        file_url: fileUrl,
        file_name: file.name,
        file_type: fileType,
        class_id: selectedClass,
        subject_name: subjectName,
        uploaded_by: user.id
      };

      const { error: dbError } = await supabase
        .from('materials')
        .insert([newMaterial]);

      if (dbError) {
        alert("Database insert failed: " + dbError.message);
      } else {
        alert("Material uploaded successfully!");
      }
    } else {
      // Fallback local mock
      fileUrl = URL.createObjectURL(file);
      const newMaterial = {
        id: Date.now().toString(),
        file_url: fileUrl,
        file_name: file.name,
        file_type: fileType,
        class_id: selectedClass,
        subject_name: subjectName,
        uploaded_by: user.id,
        created_at: new Date().toISOString()
      };
      const allSaved = JSON.parse(localStorage.getItem('ims_mock_materials') || '[]');
      localStorage.setItem('ims_mock_materials', JSON.stringify([...allSaved, newMaterial]));
      alert("Material mocked successfully (Supabase backend missing)!");
    }

    setFile(null);
    setSubjectName('');
    setLoading(false);
    fetchMaterials();
  };

  const handleDelete = async (materialId, fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    if (supabase) {
      try {
        // We'd ideally delete from storage here as well if we parsed the filename out
        await supabase.from('materials').delete().eq('id', materialId);
      } catch (err) {
        console.error(err);
      }
    } else {
      const allSaved = JSON.parse(localStorage.getItem('ims_mock_materials') || '[]');
      const filtered = allSaved.filter(m => m.id !== materialId);
      localStorage.setItem('ims_mock_materials', JSON.stringify(filtered));
    }
    fetchMaterials();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon size={20} className="text-primary" />;
      case 'video': return <VideoIcon size={20} className="text-primary" />;
      case 'pdf': return <FileIcon size={20} className="text-primary" />;
      default: return <FileIcon size={20} className="text-muted" />;
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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
                  {material.file_name}
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{material.class_id}</span>
                  <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{material.subject_name}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(material.id, material.file_url)}
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
