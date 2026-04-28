import React, { useState } from 'react';

const baseInput = {
  width: '100%',
  height: '40px',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '10px',
  padding: '0 12px',
  fontSize: '14px',
  background: '#fff',
  color: '#111827',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

export function FormField({ label, error, hint, children, style }) {
  return (
    <div style={{ marginBottom: '16px', ...style }}>
      {label && (
        <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6B7280', marginBottom: '6px', letterSpacing: '0.01em' }}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '5px' }}>{hint}</p>}
      {error && <p style={{ fontSize: '11px', color: '#E24B4A', marginTop: '5px' }}>{error}</p>}
    </div>
  );
}

export function TextInput({ type = 'text', error, onChange, onBlur, maxLength, inputMode, pattern, ...props }) {
  const [focused, setFocused] = useState(false);

  function handleChange(e) {
    // Phone: strip non-numeric characters except + at start
    if (type === 'tel') {
      const raw = e.target.value;
      const cleaned = raw.replace(/(?!^\+)[^\d\s\-()]/g, '');
      e.target.value = cleaned;
    }
    onChange && onChange(e);
  }

  function handleKeyDown(e) {
    if (type === 'tel') {
      const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Enter','Home','End'];
      const isNumber = /^[0-9]$/.test(e.key);
      const isPlus = e.key === '+' && e.target.selectionStart === 0;
      const isSpace = e.key === ' ';
      const isDash = e.key === '-';
      const isParen = e.key === '(' || e.key === ')';
      if (!isNumber && !isPlus && !isSpace && !isDash && !isParen && !allowed.includes(e.key)) {
        e.preventDefault();
      }
    }
  }

  return (
    <input
      type={type}
      style={{
        ...baseInput,
        borderColor: error ? '#E24B4A' : focused ? '#1A5F7A' : 'rgba(0,0,0,0.1)',
        boxShadow: focused ? (error ? '0 0 0 3px rgba(226,75,74,0.12)' : '0 0 0 3px rgba(26,95,122,0.12)') : 'none',
        paddingRight: type === 'password' ? '40px' : '12px',
      }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => { setFocused(false); onBlur && onBlur(e); }}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={maxLength}
      {...props}
    />
  );
}

export function SelectInput({ error, children, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      style={{
        ...baseInput,
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '32px',
        borderColor: error ? '#E24B4A' : focused ? '#1A5F7A' : 'rgba(0,0,0,0.1)',
        boxShadow: focused ? '0 0 0 3px rgba(26,95,122,0.12)' : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children}
    </select>
  );
}

export function PasswordStrength({ password }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const colors = ['', '#E24B4A', '#EF9F27', '#639922', '#1D9E75'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  if (!password) return null;

  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: score >= i ? colors[Math.min(score, 4)] : 'rgba(0,0,0,0.1)', transition: 'background 0.2s' }} />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: colors[score] || '#9CA3AF' }}>{labels[score]}</span>
    </div>
  );
}

export function PrimaryButton({ children, loading, disabled, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      style={{
        width: '100%', height: '42px',
        background: disabled || loading ? '#9CA3AF' : '#1A5F7A',
        color: '#fff', border: 'none', borderRadius: '10px',
        fontSize: '14px', fontWeight: '500', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s', letterSpacing: '0.01em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}
      {...props}
    >
      {loading && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
          <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
      )}
      {children}
    </button>
  );
}

export function Alert({ type = 'info', children }) {
  const colors = {
    info:    { bg: '#EAF4F8', border: 'rgba(26,95,122,0.25)',  text: '#0D3D52' },
    success: { bg: '#EDFAF5', border: 'rgba(29,158,117,0.25)', text: '#0F6E56' },
    error:   { bg: '#FEF0F0', border: 'rgba(226,75,74,0.2)',   text: '#991B1B' },
  };
  const c = colors[type];
  return (
    <div style={{ padding: '10px 14px', borderRadius: '10px', background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
      {children}
    </div>
  );
}