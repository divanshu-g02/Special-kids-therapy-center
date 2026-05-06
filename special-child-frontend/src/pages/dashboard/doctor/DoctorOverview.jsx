import { useEffect, useState } from 'react';
import { getSession } from '../../../services/authService';
import { getAllAppointments } from '../../../services/appointmentService';
import { getAllSlots } from '../../../services/slotService';
import { getAllFindings } from '../../../services/findingService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function DoctorOverview() {
  const { fullName } = getSession();
  const [appointments, setAppointments] = useState([]);
  const [slots,        setSlots]        = useState([]);
  const [findings,     setFindings]     = useState([]);
  const [loading,      setLoading]      = useState(true);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today    = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function load() {
      const [a, s, f] = await Promise.all([
        getAllAppointments().catch(() => []),
        getAllSlots().catch(()        => []),
        getAllFindings().catch(()     => []),
      ]);
      setAppointments(a);
      setSlots(s);
      setFindings(f);
      setLoading(false);
    }
    load();
  }, []);

  const todayAppointments = appointments.filter(a => a.appointmentDate === today);
  const pending           = appointments.filter(a => a.status === 'Scheduled').length;
  const availableSlots    = slots.filter(s => !s.isBooked).length;

  const columns = [
    { key: 'appointmentId',   label: '#' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'therapyName',     label: 'Therapy' },
    { key: 'startTime',       label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status',          label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '3px' }}>{greeting}</p>
        <h1 style={{ fontSize: '22px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827' }}>
          Dr. {fullName?.split(' ')[0]}
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '3px' }}>
          Here is your schedule for today.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Today's Patients"  value={loading ? '...' : todayAppointments.length} color="#1A5F7A" />
        <StatCard label="Pending Sessions"  value={loading ? '...' : pending}                  color="#EF9F27" />
        <StatCard label="Available Slots"   value={loading ? '...' : availableSlots}            color="#1D9E75" />
        <StatCard label="Total Findings"    value={loading ? '...' : findings.length}           color="#2E8CA8" />
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>
        Today's Schedule
      </h2>
      <DataTable
        columns={columns}
        rows={todayAppointments}
        loading={loading}
        error=""
        emptyMessage="No appointments scheduled for today."
      />
    </div>
  );
}