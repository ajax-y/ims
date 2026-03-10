import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable pagination component.
 * @param {number} total - Total number of items
 * @param {number} page - Current page (1-indexed)
 * @param {number} pageSize - Items per page
 * @param {function} onChange - Called with new page number
 */
export default function Pagination({ total, page, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      borderTop: '1px solid var(--border)',
      backgroundColor: 'var(--card-bg)',
      flexWrap: 'wrap',
      gap: '0.5rem',
    }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Showing {from}–{to} of {total}
      </span>
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          style={{
            padding: '0.4rem 0.6rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
            opacity: page === 1 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>…</span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p)}
                style={{
                  padding: '0.4rem 0.7rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: p === page ? 'var(--primary)' : 'transparent',
                  color: p === page ? 'white' : 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: p === page ? '600' : '400',
                  fontSize: '0.875rem',
                }}
              >
                {p}
              </button>
            )
          )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          style={{
            padding: '0.4rem 0.6rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
            opacity: page === totalPages ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
