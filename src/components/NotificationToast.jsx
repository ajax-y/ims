import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function NotificationToast({ user }) {
  const [toast, setToast] = useState(null);
  const seenIds = useRef(new Set());
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      // Fetch personal notifications
      const { data: pData, error: pError } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch global announcements
      const { data: aData, error: aError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (pError || aError) return;

      const merged = [
        ...(pData || []).map(n => ({ ...n, toastId: `p-${n.id}` })),
        ...(aData || []).map(a => ({ ...a, toastId: `a-${a.id}`, isAnnouncement: true }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (merged.length > 0) {
        const latest = merged[0];
        if (!seenIds.current.has(latest.toastId)) {
          seenIds.current.add(latest.toastId);
          if (!initialLoad.current) {
            setToast(latest);
            setTimeout(() => setToast(null), 5000);
          }
        }
      }
      if (initialLoad.current) initialLoad.current = false;
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user?.id]);

  if (!toast) return null;

  return (
    <div className="fade-in" style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      backgroundColor: 'var(--primary)',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      zIndex: 9999,
      maxWidth: '350px'
    }}>
      <Bell size={24} style={{ flexShrink: 0 }} />
      <div>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          {toast.isAnnouncement ? '📢 Announcement: ' : ''}{toast.title}
        </h4>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>{toast.message}</p>
      </div>
    </div>
  );
}
