import { useState } from 'react';

// ── Base styles ────────────────────────────────────────────
// Shared between Input, Select, Textarea
// Defined once here so all fields look identical
const baseStyle = {
  width:        '100%',
  height:       '38px',
  border:       '0.5px solid rgba(0,0,0,0.18)',
  borderRadius: '8px',
  padding:      '0 12px',
  fontSize:     '13px',
  fontFamily:   "'DM Sans', sans-serif",
  background:   '#fff',
  color:        '#111827',
  outline:      'none',                        // remove browser default blue outline
  boxSizing:    'border-box',                  // padding doesn't add to width
  transition:   'border-color 0.15s, box-shadow 0.15s',
};

// ── Field ──────────────────────────────────────────────────
// Wrapper that groups label + input + error together
// Every input in every form is wrapped in a Field
//
// Props:
// label    → text shown above the input e.g. "Email address"
// error    → error message shown below e.g. "Email is required"
//            only shows when it has a value
// children → the actual Input, Select or Textarea inside
// required → shows a red * after the label
export function Field({ label, error, children, required = false }) {
  return (
    // marginBottom creates space between this field and the next one
    <div style={{ marginBottom: '14px' }}>

      {/* Label — only render if label prop was passed */}
      {label && (
        <label
          style={{
            display:       'block',       // sits on its own line above input
            fontSize:      '12px',
            fontWeight:    '500',
            color:         '#6B7280',     // gray, less prominent than input text
            marginBottom:  '5px',
            letterSpacing: '0.01em',
          }}
        >
          {label}
          {/* Red asterisk for required fields */}
          {required && (
            <span style={{ color: '#E24B4A', marginLeft: '3px' }}>*</span>
          )}
        </label>
      )}

      {/* The actual input — whatever is between <Field> tags */}
      {children}

      {/* Error — only renders when error has a value */}
      {error && (
        <p
          style={{
            fontSize:   '11px',
            color:      '#E24B4A',
            marginTop:  '4px',
            marginBottom: 0,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────
// Standard text input
// Handles focus styling (blue border + shadow on focus)
// Handles error styling (red border when error exists)
//
// Props: all standard HTML input props work
// type  → 'text' | 'email' | 'password' | 'number' | 'date' | 'time' | 'tel'
// error → if passed, border turns red
export function Input({ error, ...props }) {
  // focused state for the blue border effect on focus
  const [focused, setFocused] = useState(false);

  return (
    <input
      style={{
        ...baseStyle,

        // border color changes based on state:
        // red   → when there's an error
        // blue  → when user is typing (focused)
        // gray  → default
        borderColor: error
          ? '#E24B4A'
          : focused
          ? '#1A5F7A'
          : 'rgba(0,0,0,0.18)',

        // subtle glow on focus — error glow is red, normal glow is blue
        boxShadow: focused
          ? error
            ? '0 0 0 3px rgba(226,75,74,0.12)'
            : '0 0 0 3px rgba(26,95,122,0.12)'
          : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}

      // ...props spreads all other props like:
      // type, value, onChange, placeholder, autoComplete, required, maxLength
      {...props}
    />
  );
}

// ── PasswordInput ──────────────────────────────────────────
// Same as Input but with a show/hide toggle button
// The eye icon lets users verify what they typed
export function PasswordInput({ error, ...props }) {
  const [focused, setFocused] = useState(false);
  const [show,    setShow]    = useState(false); // false = password hidden

  return (
    // position relative so the eye button can be positioned inside
    <div style={{ position: 'relative' }}>
      <input
        // toggle between password (hidden) and text (visible)
        type={show ? 'text' : 'password'}
        style={{
          ...baseStyle,
          borderColor: error
            ? '#E24B4A'
            : focused
            ? '#1A5F7A'
            : 'rgba(0,0,0,0.18)',
          boxShadow: focused
            ? error
              ? '0 0 0 3px rgba(226,75,74,0.12)'
              : '0 0 0 3px rgba(26,95,122,0.12)'
            : 'none',
          // extra right padding so text doesn't go under the eye button
          paddingRight: '40px',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />

      {/* Eye toggle button — sits inside the input on the right */}
      <button
        type="button"           // IMPORTANT: prevents form submission on click
        onClick={() => setShow(s => !s)}
        style={{
          position:  'absolute',
          right:     '10px',
          top:       '50%',
          transform: 'translateY(-50%)',   // perfectly centered vertically
          background: 'none',
          border:     'none',
          cursor:     'pointer',
          color:      '#9CA3AF',
          padding:    '4px',
          display:    'flex',
          alignItems: 'center',
        }}
      >
        {/* Show different icon based on show state */}
        {show ? (
          // Eye with slash — password is visible, click to hide
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M14.12 14.12a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ) : (
          // Eye open — password is hidden, click to show
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        )}
      </button>
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────
// Dropdown selector
// Used for: Role, Gender, Status, Payment Method etc.
//
// Props:
// children → <option> elements inside
// error    → turns border red
export function Select({ error, children, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <select
      style={{
        ...baseStyle,
        cursor: 'pointer',

        // remove browser default dropdown arrow
        // we add our own custom arrow via backgroundImage
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' fill='none' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat:   'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight:       '32px',   // space for the arrow

        borderColor: error
          ? '#E24B4A'
          : focused
          ? '#1A5F7A'
          : 'rgba(0,0,0,0.18)',

        boxShadow: focused
          ? '0 0 0 3px rgba(26,95,122,0.12)'
          : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Textarea ───────────────────────────────────────────────
// Multi-line text input
// Used for: Notes, Bio, Observations, Medical History etc.
//
// Props:
// rows  → number of visible lines, default 3
// error → turns border red
export function Textarea({ error, rows = 3, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <textarea
      rows={rows}
      style={{
        ...baseStyle,
        height:     'auto',          // override fixed height from baseStyle
        padding:    '8px 12px',      // override — textarea needs top/bottom padding
        resize:     'vertical',      // user can resize vertically but not horizontally
        lineHeight: 1.5,

        borderColor: error
          ? '#E24B4A'
          : focused
          ? '#1A5F7A'
          : 'rgba(0,0,0,0.18)',

        boxShadow: focused
          ? '0 0 0 3px rgba(26,95,122,0.12)'
          : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...props}
    />
  );
}

// ── FieldRow ───────────────────────────────────────────────
// Puts two fields side by side in a grid
// Used for: First Name + Last Name, Start Time + End Time etc.
//
// Props:
// children → exactly two Field components
export function FieldRow({ children }) {
  return (
    <div
      style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',  // two equal columns
        gap:                 '12px',     // space between the two fields
      }}
    >
      {children}
    </div>
  );
}