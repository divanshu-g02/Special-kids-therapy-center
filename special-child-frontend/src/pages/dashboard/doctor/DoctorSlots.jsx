import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllSlots, createSlot, deleteSlot } from '../../../services/slotService';
import { getDoctorByUserId } from '../../../services/doctorService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, FieldRow } from '../../../components/ui/FormFields';

export default function DoctorSlots() {
  const { data: slots, loading, error, refetch } = useApi(getAllSlots);
  const session = getSession();

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [form,     setForm]     = useState({ date: '', startTime: '', endTime: '' });

  useEffect(() => {
    const fetchDoctorId = async () => {
      if (session.userId) {
        try {
          const doctor = await getDoctorByUserId(parseInt(session.userId));
          setDoctorId(doctor.doctorId?.toString() || '');
        } catch (err) {
          console.warn('Could not fetch doctor ID:', err.message);
          toast.error('Unable to load your doctor profile. Please enter your Doctor ID manually.');
        }
      }
    };
    fetchDoctorId();
  }, [session.userId]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  function openCreate() {
    setForm({ date: '', startTime: '', endTime: '' });
    setModal('create');
  }
  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal()    { setModal(null); setSelected(null); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createSlot({ ...form, doctorId: parseInt(doctorId || 0) });
      toast.success('Slot created.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to create slot.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteSlot(selected.slotId);
      toast.success('Slot deleted.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete slot.');
    } finally {
      setSaving(false);
    }
  }

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
        <StatCard label="Available"   value={available}               color="#1D9E75" />
        <StatCard label="Booked"      value={slots.length - available} color="#EF9F27" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>My Slots</h2>
        <Button onClick={openCreate}>+ Add Slot</Button>
      </div>

      <DataTable columns={columns} rows={slots} loading={loading} error={error} onDelete={openDelete} />

      {modal === 'create' && (
        <Modal title="Add Slot" onClose={closeModal} width="400px">
          <form onSubmit={handleCreate}>
            {doctorId ? (
              <Field label="Doctor ID">
                <Input type="text" value={doctorId} disabled />
              </Field>
            ) : (
              <Field label="Doctor ID" required>
                <Input type="number" value={doctorId} onChange={e => setDoctorId(e.target.value)} required />
              </Field>
            )}
            <Field label="Date" required>
              <Input type="date" value={form.date} onChange={set('date')} required />
            </Field>
            <FieldRow>
              <Field label="Start Time" required>
                <Input type="time" value={form.startTime} onChange={set('startTime')} required />
              </Field>
              <Field label="End Time" required>
                <Input type="time" value={form.endTime} onChange={set('endTime')} required />
              </Field>
            </FieldRow>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Slot'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Slot" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Delete slot <strong>#{selected?.slotId}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}