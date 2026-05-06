import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../../services/authService';

const BRAND_DARK = '#0D3D52';
const BRAND      = '#1A5F7A';

// Nav items per role
// Each role only sees pages relevant to them
const NAV_ITEMS = {
  Admin: [
    { id: 'overview',     label: 'Overview' },
    { id: 'users',        label: 'Users' },
    { id: 'doctors',      label: 'Doctors' },
    { id: 'patients',     label: 'Patients' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'therapies',    label: 'Therapies' },
    { id: 'slots',        label: 'Slots' },
    { id: 'payments',     label: 'Payments' },
    { id: 'findings',     label: 'Findings' },
  ],
  Doctor: [
    { id: 'overview',     label: 'Overview' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients',     label: 'Patients' },
    { id: 'slots',        label: 'My Slots' },
    { id: 'findings',     label: 'Session Notes' },
  ],
  Receptionist: [
    { id: 'overview',     label: 'Overview' },
    { id: 'patients',     label: 'Patients' },
    { id: 'appointments', label: 'Book Appointment' },
    { id: 'slots',        label: 'Doctor Slots' },
    { id: 'payments',     label: 'Payments' },
  ],
  Patient: [
    { id: 'overview',     label: 'Overview' },
    { id: 'slots',        label: 'Book a Session' },
    { id: 'appointments', label: 'My Appointments' },
    { id: 'payments',     label: 'Payments' },
  ],
  Guardian: [
    { id: 'overview',     label: 'Overview' },
    { id: 'slots',        label: 'Book a Session' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'findings',     label: 'Medical Reports' },
    { id: 'payments',     label: 'Payments' },
  ],
};

// Icons for each nav item
function NavIcon({ id }) {
  const icons = {
    overview: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    users: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="12.5" cy="4.5" r="1.8" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M10.5 12c0-1.5.9-2.8 2-3.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    doctors: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    patients: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    appointments: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    therapies: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5.5 8c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
    slots: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 4.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    payments: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    findings: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M10 2v3h3M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  };
  return icons[id] || null;
}

export default function Sidebar({ activePage, onNavigate }) {
  const navigate = useNavigate();
  const { fullName, role, email } = getSession();
  const [collapsed, setCollapsed] = useState(false);

  // Get nav items for this role
  // Fall back to Patient nav if role not found
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.Patient;

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  // First letter of first and last name for avatar
  const avatar = fullName
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div style={{
      width:          collapsed ? '60px' : '230px',
      flexShrink:     0,
      background:     BRAND_DARK,
      display:        'flex',
      flexDirection:  'column',
      transition:     'width 0.2s ease',
      overflow:       'hidden',
      height:         '100vh',
      position:       'sticky',
      top:            0,
    }}>

      {/* ── Logo + collapse button ── */}
      <div style={{
        padding:       collapsed ? '18px 14px' : '22px 18px',
        borderBottom:  '0.5px solid rgba(255,255,255,0.07)',
        display:       'flex',
        alignItems:    'center',
        gap:           '10px',
        minHeight:     '66px',
      }}>
        {/* Logo mark */}
        <div style={{
          width:          '30px',
          height:         '30px',
          borderRadius:   '7px',
          background:     'rgba(255,255,255,0.12)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.3"/>
            <path d="M5.5 8h5M8 5.5v5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Brand name — hidden when collapsed */}
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>
              SKTC
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
              Staff Portal
            </div>
          </div>
        )}

        {/* Collapse/expand button */}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            marginLeft:  'auto',
            background:  'none',
            border:      'none',
            cursor:      'pointer',
            color:       'rgba(255,255,255,0.35)',
            padding:     '2px',
            display:     'flex',
            flexShrink:  0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              // collapsed → point right (expand)
              // expanded  → point left (collapse)
              d={collapsed ? 'M5 2l4.5 4.5L5 11' : 'M8 2L3.5 6.5 8 11'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Role badge ── */}
      {!collapsed && (
        <div style={{ padding: '10px 18px 4px' }}>
          <span style={{
            fontSize:      '10px',
            fontWeight:    '500',
            color:         'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {role}
          </span>
        </div>
      )}

      {/* ── Nav items ── */}
      <nav style={{
        flex:       1,
        padding:    '6px 8px',
        overflowY:  'auto',
        overflowX:  'hidden',
      }}>
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : ''}
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '9px',
                width:       '100%',
                padding:     collapsed ? '10px 14px' : '8px 12px',
                borderRadius: '7px',
                border:      'none',
                cursor:      'pointer',
                background:  isActive ? 'rgba(255,255,255,0.13)' : 'none',
                color:       isActive ? '#fff' : 'rgba(255,255,255,0.48)',
                fontSize:    '13px',
                fontWeight:  isActive ? '500' : '400',
                fontFamily:  "'DM Sans', sans-serif",
                marginBottom: '1px',
                textAlign:   'left',
                transition:  'all 0.12s',
                whiteSpace:  'nowrap',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'none';
              }}
            >
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>
                <NavIcon id={item.id} />
              </span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* ── User info + logout ── */}
      <div style={{
        padding:     '8px',
        borderTop:   '0.5px solid rgba(255,255,255,0.07)',
      }}>
        {/* User name and email — hidden when collapsed */}
        {!collapsed && (
          <div style={{ padding: '8px 12px 4px' }}>
            <div style={{
              fontSize:     '12px',
              fontWeight:   '500',
              color:        'rgba(255,255,255,0.8)',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}>
              {fullName}
            </div>
            <div style={{
              fontSize:     '11px',
              color:        'rgba(255,255,255,0.32)',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
            }}>
              {email}
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : ''}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         '8px',
            width:       '100%',
            padding:     collapsed ? '10px 14px' : '8px 12px',
            borderRadius: '7px',
            border:      'none',
            cursor:      'pointer',
            background:  'none',
            color:       'rgba(255,255,255,0.38)',
            fontSize:    '13px',
            fontFamily:  "'DM Sans', sans-serif",
            transition:  'all 0.12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  );
}