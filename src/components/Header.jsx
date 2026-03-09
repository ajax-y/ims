import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, LogOut, User, ChevronDown, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Header({ user, onToggleSidebar, onLogout, onTabChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) {
      console.error('fetchNotifications:', error.message);
      return;
    }
    setAnnouncements(data || []);
    setUnreadCount((data || []).filter(n => !n.is_read).length);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleToggleNotif = async () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);

    if (nextState && unreadCount > 0) {
      setUnreadCount(0);
      const unreadIds = announcements.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length > 0) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .in('id', unreadIds);
      }
      fetchNotifications();
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem', // Reduced from 1.5rem
      height: '70px',
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button 
          onClick={onToggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)'
          }}
          className="hover:bg-gray-100"
        >
          <Menu size={24} color="var(--text-main)" />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="mobile-header-text" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            IMS Portal
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* NOTIFICATIONS DROPDOWN */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            onClick={handleToggleNotif}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '0.5rem' }}
          >
            <Bell size={20} color="var(--text-muted)" className="hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: '14px',
                height: '14px',
                backgroundColor: 'var(--danger)',
                borderRadius: '50%',
                color: 'white',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px',
                fontWeight: 'bold'
              }}>{unreadCount}</span>
            )}
          </button>

          {isNotifOpen && (
            <div className="fade-in notification-dropdown">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Notifications</h3>
              {announcements.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0' }}>No new notifications</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {announcements.map((a) => (
                    <div key={a.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', opacity: a.is_read ? 0.7 : 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem', color: a.is_read ? 'var(--text-muted)' : 'var(--text-main)' }}>{a.title}</h4>
                        {!a.is_read && <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{a.message}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(a.date_posted).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: 'var(--primary)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)'
            }}
            className="hover:opacity-90"
          >
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <User size={18} />
            </div>
            <span className="header-username" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {user.name}
            </span>
            <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div className="fade-in header-user-dropdown">
              <div style={{
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.id}</span>
              </div>
              <div style={{ padding: '0.5rem 0' }}>
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onTabChange) onTabChange('profile');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    textAlign: 'left',
                    fontSize: '0.9rem'
                  }}
                  className="hover:bg-gray-100"
                >
                  <UserCircle size={18} />
                  My Profile
                </button>
                <button 
                  onClick={onLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--danger)',
                    textAlign: 'left',
                    fontSize: '0.9rem'
                  }}
                  className="hover:bg-gray-100"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
