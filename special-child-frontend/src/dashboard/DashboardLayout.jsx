import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSession, clearSession } from '../services/authService';

const BRAND = '#1A5F7A';
const BRAND_DARK = '#0D3D52';

// Role-based nav config
const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Patient', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Users',
    roles: ['Admin'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M11 7c1.1.5 2 1.6 2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="13" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id: 'doctors',
    label: 'Doctors',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Patient', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'patients',
    label: 'Patients',
    roles: ['Admin', 'Doctor', 'Receptionist'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    id: 'appointments',
    label: 'Appointments',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 1v4M11 1v4M1 7h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'slots',
    label: 'Slots',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Patient', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'payments',
    label: 'Payments',
    roles: ['Admin', 'Receptionist', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'findings',
    label: 'Doctor Findings',
    roles: ['Admin', 'Doctor', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M10 2v3h3M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'therapies',
    label: 'Therapies',
    roles: ['Admin', 'Doctor', 'Receptionist', 'Patient', 'Guardian'],
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5.5 8c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
  },
];

export default function DashboardLayout({ activePage, onNavigate, children }) {
  const navigate = useNavigate();
  const { fullName, role, email } = getSession();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(role));

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", background: '#F4F6F8' }}>

      {/* Sidebar */}
      <div style={{
        width: collapsed ? '64px' : '240px',
        flexShrink: 0,
        background: BRAND_DARK,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 16px' : '24px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px', minHeight: '72px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2C5.1 2 2 5.1 2 9s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3"/>
              <path d="M6 9h6M9 6v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>SKTC</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '300' }}>Staff Portal</div>
            </div>
          )}
          <button onClick={() => setCollapsed(c => !c)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px', display: 'flex', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d={collapsed ? 'M2 4l5 5 5-5' : 'M4 2l5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
          {visibleNav.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: collapsed ? '10px 12px' : '9px 12px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activePage === item.id ? 'rgba(255,255,255,0.14)' : 'none',
                color: activePage === item.id ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '13px', fontWeight: activePage === item.id ? '500' : '400',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: '2px', textAlign: 'left',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activePage !== item.id) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { if (activePage !== item.id) e.currentTarget.style.background = 'none'; }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 8px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          {!collapsed && (
            <div style={{ padding: '10px 12px', marginBottom: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{role}</div>
            </div>
          )}
          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: collapsed ? '10px 12px' : '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {!collapsed && 'Sign out'}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '0 28px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h1 style={{ fontSize: '16px', fontWeight: '500', color: '#111827', margin: 0 }}>
            {NAV_ITEMS.find(n => n.id === activePage)?.label || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EAF4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: BRAND }}>
              {fullName?.charAt(0) ?? '?'}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
