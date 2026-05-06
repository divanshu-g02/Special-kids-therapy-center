import { useApi } from '../../../hooks/useApi';
import { getAllFindings } from '../../../services/findingService';
import { getAllAppointments } from '../../../services/appointmentService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';

export default function PatientReports() {
  const { data: findings,     loading: fLoad, error: fErr } = useApi(getAllFindings);
  const { data: appointments, loading: aLoad              } = useApi(getAllAppointments);

  const completed = appointments.filter(a => a.status === 'Completed').length;

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
        <StatCard label="Total Reports"   value={findings.length} />
        <StatCard label="With Follow-up"  value={findings.filter(f => f.nextSessionDate).length} color="#2E8CA8" />
        <StatCard label="Sessions Done"   value={aLoad ? '...' : completed}                      color="#1D9E75" />
      </div>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Medical Reports</h2>
      <DataTable columns={columns} rows={findings} loading={fLoad} error={fErr} emptyMessage="No reports available yet." />
    </div>
  );
}