import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, LogOut, User, ChevronDown, UserCircle } from 'lucide-react';

function Header({ user, onToggleSidebar, onLogout, onTabChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ims_announcements') || '[]');
    setAnnouncements(saved);
  }, [isNotifOpen]);

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
      padding: '0 1.5rem',
      height: '70px',
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#000000', letterSpacing: '-0.5px' }}>
            IMS Portal
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* NOTIFICATIONS DROPDOWN */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '0.5rem' }}
          >
            <Bell size={20} color="var(--text-muted)" className="hover:text-primary transition-colors" />
            {announcements.length > 0 && (
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--danger)',
                borderRadius: '50%'
              }}></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="fade-in notification-dropdown">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Announcements</h3>
              {announcements.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', margin: '2rem 0' }}>No new announcements</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.map((a) => (
                    <div key={a.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{a.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{a.message}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(a.date).toLocaleDateString()}</span>
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
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {user.name}
            </span>
            <ChevronDown size={16} />
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              backgroundColor: 'var(--card-bg)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
              width: '200px',
              overflow: 'hidden',
              zIndex: 1000
            }}
            className="fade-in"
            >
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
