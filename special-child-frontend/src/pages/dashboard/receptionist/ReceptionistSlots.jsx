import { useApi } from '../../../hooks/useApi';
import { getAllSlots } from '../../../services/slotService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

export default function ReceptionistSlots() {
  const { data: slots, loading, error } = useApi(getAllSlots);
  const available = slots.filter(s => !s.isBooked).length;

  const columns = [
    { key: 'slotId',     label: 'ID' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date',       label: 'Date' },
    { key: 'startTime',  label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'isBooked',   label: 'Status', render: v => <Badge label={v ? 'Booked' : 'Available'} color={v ? 'orange' : 'green'} /> },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total Slots" value={slots.length} />
        <StatCard label="Available"   value={available}              color="#1D9E75" />
        <StatCard label="Booked"      value={slots.length - available} color="#EF9F27" />
      </div>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>Doctor Availability</h2>
      <DataTable columns={columns} rows={slots} loading={loading} error={error} />
    </div>
  );
}