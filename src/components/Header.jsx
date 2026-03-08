import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, LogOut, User, ChevronDown, UserCircle } from 'lucide-react';

function Header({ user, onToggleSidebar, onLogout, onTabChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            IMS Portal
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => {
            // Trigger a manual poll or pop a message by dispatching an event that NotificationToast can listen to if needed.
            // For now, we'll just show an alert since it's already polling in the background.
            // alert('Notifications are up to date.');
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}
        >
          <Bell size={20} color="var(--text-muted)" className="hover:text-primary transition-colors" />
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--danger)',
            borderRadius: '50%'
          }}></span>
        </button>

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
