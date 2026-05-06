import { useEffect, useState } from 'react';
import { getSession } from '../../../services/authService';
import { getAllAppointments } from '../../../services/appointmentService';
import { getAllSlots } from '../../../services/slotService';
import { getAllPayments } from '../../../services/paymentService';
import { getAllDoctors } from '../../../services/doctorService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function PatientOverview() {
  const { fullName, role } = getSession();
  const [appointments, setAppointments] = useState([]);
  const [slots,        setSlots]        = useState([]);
  const [payments,     setPayments]     = useState([]);
  const [doctors,      setDoctors]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    async function load() {
      const [a, s, p, d] = await Promise.all([
        getAllAppointments().catch(() => []),
        getAllSlots().catch(()        => []),
        getAllPayments().catch(()     => []),
        getAllDoctors().catch(()      => []),
      ]);
      setAppointments(a);
      setSlots(s);
      setPayments(p);
      setDoctors(d);
      setLoading(false);
    }
    load();
  }, []);

  const upcoming   = appointments.filter(a => a.status === 'Scheduled');
  const available  = slots.filter(s => !s.isBooked).length;
  const pendingPay = payments.filter(p => p.status === 'Pending').length;

  const apptColumns = [
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'therapyName',     label: 'Therapy' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'startTime',       label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status',          label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '3px' }}>{greeting}</p>
        <h1 style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827' }}>
          Welcome, {fullName?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px' }}>
          Track your sessions and book appointments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <StatCard label="Upcoming Sessions" value={loading ? '...' : upcoming.length}  color="#1A5F7A" />
        <StatCard label="Available Slots"   value={loading ? '...' : available}         color="#1D9E75" />
        <StatCard label="Pending Payments"  value={loading ? '...' : pendingPay}        color="#EF9F27" />
        <StatCard label="Our Doctors"       value={loading ? '...' : doctors.length}    color="#2E8CA8" />
      </div>

      {/* Doctor cards */}
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>Our Doctors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {doctors.slice(0, 6).map(d => (
          <div key={d.doctorId} style={{ background: '#fff', borderRadius: '12px', border: '0.5px solid rgba(0,0,0,0.08)', padding: '18px 20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EAF4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#1A5F7A', marginBottom: '10px' }}>
              {d.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '3px' }}>{d.fullName}</p>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>{d.specialization || 'General'}</p>
            {d.availableDays && (
              <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>{d.availableDays}</p>
            )}
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>Upcoming Appointments</h2>
      <DataTable
        columns={apptColumns}
        rows={upcoming.slice(0, 8)}
        loading={loading}
        error=""
        emptyMessage="No upcoming appointments."
      />
    </div>
  );
}