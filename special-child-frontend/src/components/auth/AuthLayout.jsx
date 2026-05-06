import React from 'react';

const INFO_BLOCKS = [
  {
    title: 'Role-based access',
    desc: 'Admins, Doctors, and Receptionists each have separate permissions',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3"/>
        <path d="M5 7V5a3 3 0 016 0v2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Secure JWT sessions',
    desc: 'Tokens expire automatically and are verified on every request',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3"/>
        <path d="M8 5v3l2 1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Admin-only registration',
    desc: 'New accounts require an invite token from an administrator',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="5.5" r="2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3"/>
        <path d="M2 13c0-2.5 2-4.5 4.5-4.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M11 9v4M9 11h4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function AuthLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <div style={{ width: '300px', flexShrink: 0, background: '#0D3D52', padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 3C6.58 3 3 6.58 3 11s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4"/>
                <path d="M7.5 11h7M11 7.5v7" stroke="rgba(255,255,255,0.95)" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.92)', lineHeight: 1.35 }}>
                Special Kids<br/>Therapy Center
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '300', marginTop: '2px' }}>Staff Portal</div>
            </div>
          </div>

          {/* Info blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {INFO_BLOCKS.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {b.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)' }}>{b.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, borderTop: '0.5px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          © {new Date().getFullYear()} Special Kids Therapy Center<br/>
          All access is logged and monitored.
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, background: '#F4F6F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        {children}
      </div>
    </div>
  );
}