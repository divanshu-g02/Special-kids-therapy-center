// src/components/ui/Button.jsx

// Button handles all clickable actions in the app.
// There are 4 variants, each with a different visual meaning:
//
// primary → main action  (blue)  e.g. Save, Create, Submit
// outline → secondary    (gray)  e.g. Cancel, Back
// danger  → destructive  (red)   e.g. Delete, Remove
// success → positive     (green) e.g. Confirm, Approve

// Each variant's colors defined in one place.
// Change here → updates every button in the app.
const VARIANTS = {
  primary: {
    background:  '#1A5F7A',
    color:       '#fff',
    border:      'none',
    hoverBg:     '#2E8CA8',
  },
  outline: {
    background:  'transparent',
    color:       '#374151',
    border:      '0.5px solid rgba(0,0,0,0.2)',
    hoverBg:     '#F9FAFB',
  },
  danger: {
    background:  'transparent',
    color:       '#E24B4A',
    border:      '0.5px solid rgba(226,75,74,0.3)',
    hoverBg:     '#FEF0F0',
  },
  success: {
    background:  '#1D9E75',
    color:       '#fff',
    border:      'none',
    hoverBg:     '#178C68',
  },
};

// Props:
// children  → button label text, e.g. "Save Changes"
// onClick   → function to call when clicked
// variant   → 'primary' | 'outline' | 'danger' | 'success'
// disabled  → true when loading, prevents double clicks
// type      → 'button' | 'submit' — important for forms
// fullWidth → true makes button stretch full width
export default function Button({
  children,
  onClick,
  variant  = 'primary',
  disabled = false,
  type     = 'button',
  fullWidth = false,
}) {
  // get the right colors for this variant
  // fall back to primary if unknown variant passed
  const v = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}

      // onMouseEnter / onMouseLeave gives hover effect
      // we can't use CSS :hover with inline styles
      // so we swap background manually on hover
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.background = v.hoverBg;
      }}
      onMouseLeave={e => {
        if (!disabled) e.currentTarget.style.background = v.background;
      }}

      style={{
        // layout
        display:        'inline-flex',   // icon + text side by side
        alignItems:     'center',
        justifyContent: 'center',
        gap:            '6px',           // space between icon and text
        width:          fullWidth ? '100%' : 'auto',

        // spacing
        padding:        '8px 18px',
        height:         '38px',

        // typography
        fontSize:       '13px',
        fontWeight:     '500',
        fontFamily:     "'DM Sans', sans-serif",
        whiteSpace:     'nowrap',         // never wraps to two lines

        // visual
        background:     v.background,
        color:          v.color,
        border:         v.border,
        borderRadius:   '8px',

        // state
        cursor:         disabled ? 'not-allowed' : 'pointer',
        opacity:        disabled ? 0.6 : 1,      // looks faded when disabled
        transition:     'background 0.15s, opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
}