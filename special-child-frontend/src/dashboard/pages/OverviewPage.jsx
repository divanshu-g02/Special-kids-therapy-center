import React, { useEffect, useState } from 'react';
import { StatCard } from '../DashboardComponents';
import { usersApi, doctorsApi, patientsApi, appointmentsApi, paymentsApi } from '../../services/apiService';
import { getSession } from '../../services/authService';

const BRAND = '#1A5F7A';

export default function OverviewPage() {
  const { role, fullName } = getSession();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = {};
      const calls = [];
      if (['Admin'].includes(role))                              calls.push(usersApi.getAll().then(d => results.users = d.length).catch(() => {}));
      if (['Admin','Doctor','Receptionist','Patient','Guardian'].includes(role)) calls.push(doctorsApi.getAll().then(d => results.doctors = d.length).catch(() => {}));
      if (['Admin','Doctor','Receptionist'].includes(role))     calls.push(patientsApi.getAll().then(d => results.patients = d.length).catch(() => {}));
      if (['Admin','Doctor','Receptionist','Guardian'].includes(role)) calls.push(appointmentsApi.getAll().then(d => results.appointments = d.length).catch(() => {}));
      if (['Admin','Receptionist','Guardian'].includes(role))   calls.push(paymentsApi.getAll().then(d => results.payments = d.length).catch(() => {}));
      await Promise.all(calls);
      setCounts(results);
      setLoading(false);
    }
    load();
  }, [role]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>{greeting}</p>
        <h1 style={{ fontSize: '24px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827' }}>
          Welcome back, {fullName?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
          Here's an overview of the clinic today.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {counts.users !== undefined && (
          <StatCard label="Total Users" value={loading ? '…' : counts.users} sub="Registered staff" color={BRAND}
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M1 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M13 9c1.7.8 3 2.6 3 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="15" cy="6" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>}
          />
        )}
        {counts.doctors !== undefined && (
          <StatCard label="Doctors" value={loading ? '…' : counts.doctors} sub="Active physicians" color="#2E8CA8"
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
          />
        )}
        {counts.patients !== undefined && (
          <StatCard label="Patients" value={loading ? '…' : counts.patients} sub="Under care" color="#1D9E75"
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="1" y="1" width="16" height="16" rx="3.5" stroke="currentColor" strokeWidth="1.4"/></svg>}
          />
        )}
        {counts.appointments !== undefined && (
          <StatCard label="Appointments" value={loading ? '…' : counts.appointments} sub="Total scheduled" color="#EF9F27"
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="3" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 1v4M13 1v4M1 8h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
          />
        )}
        {counts.payments !== undefined && (
          <StatCard label="Payments" value={loading ? '…' : counts.payments} sub="Transactions" color="#639922"
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="4" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 8h16" stroke="currentColor" strokeWidth="1.4"/><path d="M4 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
          />
        )}
      </div>

      {/* Info card */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.08)', padding: '24px 28px' }}>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7 }}>
          Use the sidebar to navigate between sections. Your access is based on your role: <strong style={{ color: '#111827' }}>{role}</strong>.
        </p>
      </div>
    </div>
  );
}
