import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationToast({ user }) {
  const [toast, setToast] = useState(null);
  const seenIds = useRef(new Set());
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const res = await fetch('http://localhost:8000/notifications/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          const relevant = data.filter(n => n.target_role === 'All' || n.target_role.toLowerCase() === user.role.toLowerCase());
          
          if (relevant.length > 0) {
            const latest = relevant[0];
            if (!seenIds.current.has(latest.id)) {
              seenIds.current.add(latest.id);
              if (!initialLoad.current) {
                setToast(latest);
                setTimeout(() => setToast(null), 5000);
              }
            }
          }
          if (initialLoad.current) initialLoad.current = false;
        }
      } catch (err) {}
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user]);

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
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>{toast.title}</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>{toast.message}</p>
      </div>
    </div>
  );
}
