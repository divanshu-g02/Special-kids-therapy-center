import React, { useState } from 'react';

const BRAND = '#1A5F7A';

// ── Stat Card
export function StatCard({ label, value, sub, color = BRAND, icon }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.08)', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
        <p style={{ fontSize: '28px', fontWeight: '600', color: '#111827', lineHeight: 1, marginBottom: '4px' }}>{value ?? '—'}</p>
        {sub && <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{sub}</p>}
      </div>
      {icon && (
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      )}
    </div>
  );
}

// ── Data Table
export function DataTable({ columns, rows, loading, error, onEdit, onDelete, emptyMessage = 'No records found' }) {
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF', fontSize: '14px' }}>Loading…</div>
  );
  if (error) return (
    <div style={{ textAlign: 'center', padding: '48px', color: '#E24B4A', fontSize: '14px' }}>{error}</div>
  );

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#F9FAFB' }}>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: '500', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th style={{ padding: '11px 16px', textAlign: 'right', fontWeight: '500', color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>{emptyMessage}</td></tr>
            ) : rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '12px 16px', color: '#111827', whiteSpace: col.wrap ? 'normal' : 'nowrap' }}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {onEdit && (
                      <button onClick={() => onEdit(row)} style={{ background: 'none', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: '#374151', marginRight: '6px', fontFamily: "'DM Sans', sans-serif" }}>Edit</button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} style={{ background: 'none', border: '0.5px solid rgba(226,75,74,0.3)', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: '#E24B4A', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Badge
export function Badge({ label, color = 'gray' }) {
  const colors = {
    green:  { bg: '#EDFAF5', text: '#0F6E56' },
    red:    { bg: '#FEF0F0', text: '#991B1B' },
    blue:   { bg: '#EAF4F8', text: '#1A5F7A' },
    orange: { bg: '#FFF7ED', text: '#92400E' },
    gray:   { bg: '#F3F4F6', text: '#374151' },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: '500', background: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

// ── Modal
export function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Form Field 
export function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '5px' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '11px', color: '#E24B4A', marginTop: '4px' }}>{error}</p>}
    </div>
  );
}

const inputStyle = {
  width: '100%', height: '38px', border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px',
  padding: '0 10px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
  background: '#fff', color: '#111827', outline: 'none', boxSizing: 'border-box',
};

export function Input({ ...props }) {
  return <input style={inputStyle} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: '28px' }} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ ...props }) {
  return <textarea style={{ ...inputStyle, height: '80px', padding: '8px 10px', resize: 'vertical' }} {...props} />;
}

// ── Section Header
export function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>{title}</h2>
      {action}
    </div>
  );
}

// ── Action Button
export function ActionButton({ onClick, children, variant = 'primary' }) {
  const styles = {
    primary: { background: BRAND, color: '#fff', border: 'none' },
    outline: { background: 'none', color: '#374151', border: '0.5px solid rgba(0,0,0,0.2)' },
    danger:  { background: 'none', color: '#E24B4A', border: '0.5px solid rgba(226,75,74,0.3)' },
  };
  return (
    <button onClick={onClick} style={{ ...styles[variant], padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
      {children}
    </button>
  );
}

// ── Alert
export function Alert({ type = 'error', children }) {
  const c = type === 'error'
    ? { bg: '#FEF0F0', border: 'rgba(226,75,74,0.2)', text: '#991B1B' }
    : { bg: '#EDFAF5', border: 'rgba(29,158,117,0.25)', text: '#0F6E56' };
  return (
    <div style={{ padding: '10px 14px', borderRadius: '8px', background: c.bg, border: `0.5px solid ${c.border}`, color: c.text, fontSize: '13px', marginBottom: '16px' }}>
      {children}
    </div>
  );
}
