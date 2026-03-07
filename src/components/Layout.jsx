import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Layout({ user, role, activeTab, onTabChange, onLogout, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-close sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>
        <Header user={user} onToggleSidebar={toggleSidebar} onLogout={onLogout} onTabChange={onTabChange} />
      </div>
      
      <div style={{ display: 'flex', flex: 1, marginTop: '70px' }}>
        <Sidebar role={role} activeTab={activeTab} onTabChange={onTabChange} isOpen={isSidebarOpen} />
        
        <main style={{
          flex: 1,
          padding: '2rem',
          marginLeft: isSidebarOpen && window.innerWidth >= 768 ? '260px' : '0',
          transition: 'var(--transition)',
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90
          }}
        />
      )}
    </div>
  );
}

export default Layout;
