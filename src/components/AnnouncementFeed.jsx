import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Megaphone } from 'lucide-react';

const AnnouncementFeed = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('fetchAnnouncements:', error.message);
    } else {
      setAnnouncements(data || []);
    }
    setLoading(false);
  };

  if (loading) return null;
  if (announcements.length === 0) return null;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Megaphone size={20} className="text-primary" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>Latest Announcements</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {announcements.map((a) => (
          <div key={a.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', lastChild: { borderBottom: 'none' } }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{a.title}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{a.message}</p>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(a.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementFeed;
