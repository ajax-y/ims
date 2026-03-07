import React from 'react';
import { Bell, Menu, LogOut, User } from 'lucide-react';

function Header({ user, onToggleSidebar, onLogout }) {
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
        <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)' }}>
          IMS Portal
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} color="var(--text-muted)" />
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

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--primary)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          color: 'white',
          boxShadow: 'var(--shadow-sm)'
        }}>
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
        </div>

        <button 
          onClick={onLogout}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          title="Logout"
        >
          <LogOut size={20} color="var(--danger)" />
        </button>
      </div>
    </header>
  );
}

export default Header;
