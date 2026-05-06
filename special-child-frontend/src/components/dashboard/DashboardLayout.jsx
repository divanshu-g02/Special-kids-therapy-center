import { getSession } from '../../services/authService';
import Sidebar from './Sidebar';

// Nav item labels for the topbar title
const PAGE_LABELS = {
  overview:     'Overview',
  users:        'Users',
  doctors:      'Doctors',
  patients:     'Patients',
  appointments: 'Appointments',
  therapies:    'Therapies',
  slots:        'Slots',
  payments:     'Payments',
  findings:     'Doctor Findings',
};

export default function DashboardLayout({ activePage, onNavigate, children }) {
  const { fullName } = getSession();

  // First two initials for avatar
  const avatar = fullName
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

  return (
    <div style={{
      display:    'flex',
      minHeight:  '100vh',
      fontFamily: "'DM Sans', sans-serif",
      background: '#F4F6F8',
    }}>

      {/* ── Sidebar ── */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* ── Main content area ── */}
      <div style={{
        flex:          1,
        display:       'flex',
        flexDirection: 'column',
        overflow:      'auto',
        minWidth:      0,  // prevents flex overflow
      }}>

        {/* ── Top bar ── */}
        <div style={{
          background:    '#fff',
          borderBottom:  '0.5px solid rgba(0,0,0,0.07)',
          padding:       '0 28px',
          height:        '54px',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          flexShrink:    0,
          position:      'sticky',
          top:           0,
          zIndex:        100,
        }}>
          {/* Current page title */}
          <h1 style={{
            fontSize:   '15px',
            fontWeight: '500',
            color:      '#111827',
            margin:     0,
          }}>
            {PAGE_LABELS[activePage] || 'Dashboard'}
          </h1>

          {/* Right side — date + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              {new Date().toLocaleDateString('en-PK', {
                weekday: 'short',
                day:     'numeric',
                month:   'short',
              })}
            </span>

            {/* Avatar circle */}
            <div style={{
              width:          '30px',
              height:         '30px',
              borderRadius:   '50%',
              background:     '#EAF4F8',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '11px',
              fontWeight:     '600',
              color:          '#1A5F7A',
            }}>
              {avatar}
            </div>
          </div>
        </div>

        {/* ── Page content ── */}
        {/* This is where AdminOverview, AdminUsers etc render */}
        <div style={{
          flex:     1,
          padding:  '24px 28px',
          overflow: 'auto',
        }}>
          {children}
        </div>

      </div>
    </div>
  );
}