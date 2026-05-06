import { useApi } from '../../../hooks/useApi';
import { getAllAppointments } from '../../../services/appointmentService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function PatientAppointments() {
  const { data: appointments, loading, error } = useApi(getAllAppointments);

  const columns = [
    { key: 'appointmentId',   label: '#' },
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'therapyName',     label: 'Therapy' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'startTime',       label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status',          label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
    { key: 'notes',           label: 'Notes', wrap: true },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total"     value={appointments.length} />
        <StatCard label="Upcoming"  value={appointments.filter(a => a.status === 'Scheduled').length} color="#2E8CA8" />
        <StatCard label="Completed" value={appointments.filter(a => a.status === 'Completed').length} color="#1D9E75" />
        <StatCard label="Cancelled" value={appointments.filter(a => a.status === 'Cancelled').length} color="#E24B4A" />
      </div>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Appointments</h2>
      <DataTable columns={columns} rows={appointments} loading={loading} error={error} />
    </div>
  );
}