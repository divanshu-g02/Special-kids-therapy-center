import { useEffect, useState } from 'react';
import { getSession } from '../../../services/authService';
import { getAllAppointments } from '../../../services/appointmentService';
import { getAllPatients } from '../../../services/patientService';
import { getAllSlots } from '../../../services/slotService';
import { getAllPayments } from '../../../services/paymentService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function ReceptionistOverview() {
  const { fullName } = getSession();
  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [slots,        setSlots]        = useState([]);
  const [payments,     setPayments]     = useState([]);
  const [loading,      setLoading]      = useState(true);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today    = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      const [a, p, s, pay] = await Promise.all([
        getAllAppointments().catch(() => []),
        getAllPatients().catch(()     => []),
        getAllSlots().catch(()        => []),
        getAllPayments().catch(()     => []),
      ]);
      setAppointments(a);
      setPatients(p);
      setSlots(s);
      setPayments(pay);
      setLoading(false);
    }
    load();
  }, []);

  const todayAppointments = appointments.filter(a => a.appointmentDate === today);
  const availableSlots    = slots.filter(s => !s.isBooked).length;
  const pendingPayments   = payments.filter(p => p.status === 'Pending').length;

  const columns = [
    { key: 'appointmentId',   label: '#' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'doctorName',      label: 'Doctor' },
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
          Manage today's appointments and patients.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Today's Appointments" value={loading ? '...' : todayAppointments.length} color="#1A5F7A" />
        <StatCard label="Total Patients"        value={loading ? '...' : patients.length}          color="#2E8CA8" />
        <StatCard label="Available Slots"       value={loading ? '...' : availableSlots}           color="#1D9E75" />
        <StatCard label="Pending Payments"      value={loading ? '...' : pendingPayments}          color="#EF9F27" />
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>
        Today's Appointments
      </h2>
      <DataTable
        columns={columns}
        rows={todayAppointments}
        loading={loading}
        error=""
        emptyMessage="No appointments today."
      />
    </div>
  );
}