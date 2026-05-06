import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { getAllAppointments } from '../../../services/appointmentService';
import { getPatientByUserId } from '../../../services/patientService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function PatientAppointments() {
  const session = getSession();
  const { data: appointments, loading, error } = useApi(getAllAppointments);
  const [patientId, setPatientId] = useState(null);

  // ✅ Fetch patient ID from session userId on mount
  useEffect(() => {
    const fetchPatientId = async () => {
      if (session.userId) {
        try {
          const patient = await getPatientByUserId(parseInt(session.userId));
          setPatientId(patient.patientId);
        } catch (err) {
          console.warn('Could not fetch patient ID:', err.message);
        }
      }
    };
    fetchPatientId();
  }, [session.userId]);

  // ✅ Filter appointments by logged-in patient
  const myAppointments = patientId 
    ? appointments.filter(a => a.patientId === patientId)
    : appointments;

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
        <StatCard label="Total"     value={myAppointments.length} />
        <StatCard label="Upcoming"  value={myAppointments.filter(a => a.status === 'Scheduled').length} color="#2E8CA8" />
        <StatCard label="Completed" value={myAppointments.filter(a => a.status === 'Completed').length} color="#1D9E75" />
        <StatCard label="Cancelled" value={myAppointments.filter(a => a.status === 'Cancelled').length} color="#E24B4A" />
      </div>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Appointments</h2>
      <DataTable columns={columns} rows={myAppointments} loading={loading} error={error} />
    </div>
  );
}