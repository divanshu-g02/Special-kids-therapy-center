import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllAppointments, updateAppointment } from '../../../services/appointmentService';
import { getDoctorByUserId } from '../../../services/doctorService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Select, Textarea } from '../../../components/ui/FormFields';

const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function DoctorAppointments() {
  const session = getSession();
  const { data: appointments, loading, error, refetch } = useApi(getAllAppointments);
  const [doctorId, setDoctorId] = useState(null);
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });

  // ✅ Fetch doctor ID from session userId on mount
  useEffect(() => {
    const fetchDoctorId = async () => {
      if (session.userId) {
        try {
          const doctor = await getDoctorByUserId(parseInt(session.userId));
          setDoctorId(doctor.doctorId);
        } catch (err) {
          console.warn('Could not fetch doctor ID:', err.message);
        }
      }
    };
    fetchDoctorId();
  }, [session.userId]);

  const setE = key => e => setEditForm(f => ({ ...f, [key]: e.target.value }));

  function openEdit(row) {
    setSelected(row);
    setEditForm({ status: row.status, notes: row.notes || '' });
    setModal('edit');
  }

  function closeModal() { setModal(null); setSelected(null); }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAppointment(selected.appointmentId, editForm);
      toast.success('Appointment updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  }

  // ✅ Filter appointments by logged-in doctor
  const myAppointments = doctorId 
    ? appointments.filter(a => a.doctorId === doctorId)
    : appointments;

  const scheduled = myAppointments.filter(a => a.status === 'Scheduled').length;
  const completed = myAppointments.filter(a => a.status === 'Completed').length;

  const columns = [
    { key: 'appointmentId',   label: '#' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'therapyName',     label: 'Therapy' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'startTime',       label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status',          label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total"     value={myAppointments.length} />
        <StatCard label="Scheduled" value={scheduled}           color="#2E8CA8" />
        <StatCard label="Completed" value={completed}           color="#1D9E75" />
        <StatCard label="Cancelled" value={myAppointments.filter(a => a.status === 'Cancelled').length} color="#E24B4A" />
      </div>

      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Appointments</h2>
      <DataTable
        columns={columns}
        rows={myAppointments}
        loading={loading}
        error={error}
        onEdit={openEdit}
      />

      {modal === 'edit' && (
        <Modal title="Update Appointment" onClose={closeModal} width="400px">
          <form onSubmit={handleUpdate}>
            <Field label="Status">
              <Select value={editForm.status} onChange={setE('status')}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Notes">
              <Textarea value={editForm.notes} onChange={setE('notes')} rows={3} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}