import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const TOAST_STYLES = {
  success: { bg: '#10b981', icon: '✓' },
  error:   { bg: '#ef4444', icon: '✗' },
  warning: { bg: '#f59e0b', icon: '⚠' },
  info:    { bg: '#3b82f6', icon: 'ℹ' },
};

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '1.25rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 99999,
      width: 'min(420px, calc(100vw - 2rem))',
      alignItems: 'stretch',
    }}>
      {toasts.map(toast => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
        return (
          <div
            key={toast.id}
            className="fade-in"
            style={{
              backgroundColor: style.bg,
              color: 'white',
              padding: '0.875rem 1.25rem',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <span style={{
              fontSize: '1.1rem',
              fontWeight: 'bold',
              flexShrink: 0,
              marginTop: '1px',
            }}>{style.icon}</span>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, flex: 1, wordBreak: 'break-word' }}>
              {toast.message}
            </p>
            <button
              onClick={() => onRemove(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >×</button>
          </div>
        );
      })}
    </div>
  );
}
