import { useApi } from '../../../hooks/useApi';
import { getAllPatients } from '../../../services/patientService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

export default function DoctorPatients() {
  const { data: patients, loading, error } = useApi(getAllPatients);

  const columns = [
    { key: 'patientId',    label: 'ID' },
    { key: 'firstName',    label: 'Name',       render: (_, r) => `${r.firstName} ${r.lastName}` },
    { key: 'dateOfBirth',  label: 'DOB' },
    { key: 'gender',       label: 'Gender',     render: v => <Badge label={v} color={v === 'Male' ? 'blue' : v === 'Female' ? 'purple' : 'gray'} /> },
    { key: 'guardianName', label: 'Guardian' },
    { key: 'medicalHistory', label: 'Medical History', wrap: true },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total Patients" value={patients.length} />
        <StatCard label="Male"   value={patients.filter(p => p.gender === 'Male').length}   color="#2E8CA8" />
        <StatCard label="Female" value={patients.filter(p => p.gender === 'Female').length} color="#D4537E" />
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Patients</h2>
      <DataTable columns={columns} rows={patients} loading={loading} error={error} />
    </div>
  );
}