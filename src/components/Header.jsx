import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, LogOut, User, ChevronDown, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Header({ user, onToggleSidebar, onLogout, onTabChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    // Fetch personal notifications
    const { data: personalNotifs, error: pError } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(15);
      
    // Fetch global announcements
    const { data: globalAnnouncements, error: aError } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (pError) console.error('fetchNotifications:', pError.message);
    if (aError) console.error('fetchAnnouncements:', aError.message);

    // Merge and sort
    const merged = [
      ...(personalNotifs || []).map(n => ({ ...n, type: 'personal' })),
      ...(globalAnnouncements || []).map(a => ({ 
        ...a, 
        type: 'announcement', 
        is_read: localStorage.getItem(`ims_read_announcement_${a.id}`) === 'true'
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setNotifs(merged);
    setUnreadCount(merged.filter(n => !n.is_read).length);
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
      // Mark personal notifications as read in DB
      const unreadPersonalIds = notifs
        .filter(n => n.type === 'personal' && !n.is_read)
        .map(n => n.id);
        
      if (unreadPersonalIds.length > 0) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .in('id', unreadPersonalIds);
      }
      
      // Mark announcements as read in LocalStorage
      notifs.filter(n => n.type === 'announcement' && !n.is_read).forEach(a => {
        localStorage.setItem(`ims_read_announcement_${a.id}`, 'true');
      });

      setUnreadCount(0);
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
              {notifs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0' }}>No new notifications</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {notifs.map((n) => (
                    <div key={`${n.type}-${n.id}`} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', opacity: n.is_read ? 0.7 : 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem', color: n.is_read ? 'var(--text-muted)' : 'var(--text-main)' }}>
                            {n.type === 'announcement' && <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '1px 5px', borderRadius: '4px', marginRight: '5px' }}>GLOBAL</span>}
                            {n.title}
                          </h4>
                        </div>
                        {!n.is_read && <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></span>}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{n.message}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</span>
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
