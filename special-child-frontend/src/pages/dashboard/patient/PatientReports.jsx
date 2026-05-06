import { useState, useEffect } from 'react';
import { useApi } from '../../../hooks/useApi';
import { getAllFindings } from '../../../services/findingService';
import { getAllAppointments } from '../../../services/appointmentService';
import { getPatientByUserId } from '../../../services/patientService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';

export default function PatientReports() {
  const session = getSession();
  const { data: findings,     loading: fLoad, error: fErr } = useApi(getAllFindings);
  const { data: appointments, loading: aLoad              } = useApi(getAllAppointments);
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
    : [];

  // ✅ Filter findings by logged-in patient's appointments
  const myFindings = patientId
    ? findings.filter(f => myAppointments.some(a => a.appointmentId === f.appointmentId))
    : findings;

  const completed = myAppointments.filter(a => a.status === 'Completed').length;

  const columns = [
    { key: 'findingId',       label: '#' },
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'observations',    label: 'Observations',    wrap: true },
    { key: 'recommendations', label: 'Recommendations', wrap: true },
    { key: 'nextSessionDate', label: 'Next Session' },
    { key: 'createdAt',       label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total Reports"   value={myFindings.length} />
        <StatCard label="With Follow-up"  value={myFindings.filter(f => f.nextSessionDate).length} color="#2E8CA8" />
        <StatCard label="Sessions Done"   value={aLoad ? '...' : completed}                      color="#1D9E75" />
      </div>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Medical Reports</h2>
      <DataTable columns={columns} rows={myFindings} loading={fLoad} error={fErr} emptyMessage="No reports available yet." />
    </div>
  );
}