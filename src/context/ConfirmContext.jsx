import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const confirm = useCallback((message, title = 'Are you sure?', danger = true) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialog({ message, title, danger });
    });
  }, []);

  const handleConfirm = () => {
    resolverRef.current?.(true);
    setDialog(null);
  };

  const handleCancel = () => {
    resolverRef.current?.(false);
    setDialog(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <div
          onClick={handleCancel}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="fade-in"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              padding: '2rem',
              width: '100%',
              maxWidth: '400px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              {dialog.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              {dialog.message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: 'var(--text-main)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: dialog.danger ? 'var(--danger)' : 'var(--primary)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}
