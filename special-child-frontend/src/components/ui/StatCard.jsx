// src/components/ui/StatCard.jsx

// StatCard shows a single metric on the dashboard.
// Every page shows 3-5 of these at the top before the table.
//
// Props:
// label → title of the metric   e.g. "Total Users"
// value → the number or text    e.g. 24 or "Rs. 45,000"
// sub   → small description     e.g. "All registered"
// color → accent color for icon background
//         defaults to brand blue
// icon  → SVG element shown on the right
//         optional — card still works without it
export default function StatCard({
  label,
  value,
  sub,
  color = '#1A5F7A',
  icon,
}) {
  return (
    <div
      style={{
        background:   '#fff',
        borderRadius: '12px',
        border:       '0.5px solid rgba(0,0,0,0.08)',
        padding:      '20px 22px',

        // flex row: text on left, icon on right
        display:        'flex',
        alignItems:     'flex-start',
        justifyContent: 'space-between',

        // min-width 0 prevents overflow in grid layouts
        minWidth: 0,
      }}
    >
      {/* ── Left side: label, value, sub ── */}
      <div style={{ minWidth: 0 }}>

        {/* Label — uppercase, small, gray */}
        <p
          style={{
            fontSize:      '11px',
            color:         '#6B7280',
            fontWeight:    '500',
            marginBottom:  '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin:        '0 0 6px 0',
          }}
        >
          {label}
        </p>

        {/* Value — large and bold, the main number */}
        {/* ?? '—' means: if value is null or undefined, show a dash */}
        <p
          style={{
            fontSize:     '26px',
            fontWeight:   '600',
            color:        '#111827',
            lineHeight:   1,
            margin:       '0 0 4px 0',
          }}
        >
          {value ?? '—'}
        </p>

        {/* Sub — small description below the number */}
        {/* Only renders if sub prop was passed */}
        {sub && (
          <p
            style={{
              fontSize: '12px',
              color:    '#9CA3AF',
              margin:   0,
            }}
          >
            {sub}
          </p>
        )}
      </div>

      {/* ── Right side: icon ── */}
      {/* Only renders if icon prop was passed */}
      {icon && (
        <div
          style={{
            // circle background using the color prop at 10% opacity
            // e.g. if color = '#1A5F7A', background = '#1A5F7A' + '18'
            // '18' in hex = about 10% opacity — gives a soft tinted circle
            width:          '40px',
            height:         '40px',
            borderRadius:   '10px',
            background:     `${color}18`,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            color:          color,          // icon inherits this color
            flexShrink:     0,              // never shrinks even in small containers
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}