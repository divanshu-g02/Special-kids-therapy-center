// src/pages/admin/AdminOverview.jsx
import { useEffect, useState } from 'react';
import { getSession } from '../../../services/authService';
import { getAllUsers } from '../../../services/userService';
import { getAllDoctors } from '../../../services/doctorService';
import { getAllPatients } from '../../../services/patientService';
import { getAllAppointments } from '../../../services/appointmentService';
import { getAllPayments } from '../../../services/paymentService';
import StatCard from '../../../components/ui/StatCard';

export default function AdminOverview() {
  const { fullName } = getSession();
  const [counts,  setCounts]  = useState({});
  const [loading, setLoading] = useState(true);

  const hour    = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function load() {
      // Run all API calls at the same time with Promise.all
      // Much faster than running them one by one
      const [users, doctors, patients, appointments, payments] = await Promise.all([
        getAllUsers().catch(() => []),
        getAllDoctors().catch(() => []),
        getAllPatients().catch(() => []),
        getAllAppointments().catch(() => []),
        getAllPayments().catch(() => []),
      ]);

      const revenue = payments
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);

      setCounts({
        users:        users.length,
        doctors:      doctors.length,
        patients:     patients.length,
        appointments: appointments.length,
        revenue,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '3px' }}>{greeting}</p>
        <h1 style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827' }}>
          Welcome back, {fullName?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px' }}>
          Here is the clinic summary.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '14px',
        marginBottom: '28px',
      }}>
        <StatCard label="Total Users"    value={loading ? '...' : counts.users}        sub="All registered"     color="#1A5F7A" />
        <StatCard label="Doctors"        value={loading ? '...' : counts.doctors}      sub="Active physicians"  color="#2E8CA8" />
        <StatCard label="Patients"       value={loading ? '...' : counts.patients}     sub="Under care"         color="#1D9E75" />
        <StatCard label="Appointments"   value={loading ? '...' : counts.appointments} sub="Total scheduled"    color="#EF9F27" />
        <StatCard label="Revenue"        value={loading ? '...' : `Rs. ${counts.revenue?.toLocaleString()}`} sub="Completed payments" color="#639922" />
      </div>

      {/* Info */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.08)', padding: '20px 24px' }}>
        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.7, margin: 0 }}>
          Use the sidebar to navigate. You are logged in as <strong style={{ color: '#111827' }}>Admin</strong> — you have full access to all sections.
        </p>
      </div>
    </div>
  );
}