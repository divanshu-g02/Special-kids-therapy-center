import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllAppointments, createAppointment, updateAppointment, deleteAppointment } from '../../../services/appointmentService';
import { getAllPatients } from '../../../services/patientService';
import { getAllDoctors } from '../../../services/doctorService';
import { getAllTherapies } from '../../../services/therapyService';
import { getAllUsers } from '../../../services/userService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge, { appointmentStatusColor } from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, Textarea, FieldRow } from '../../../components/ui/FormFields';

const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

export default function AdminAppointments() {
  const { role } = getSession();
  const { data: appointments, loading, error, refetch } = useApi(getAllAppointments);
  const { data: patients = [] }  = useApi(getAllPatients);
  const { data: doctors = [] }   = useApi(getAllDoctors);
  const { data: therapies = [] } = useApi(getAllTherapies);
  const { data: users = [] }     = useApi(getAllUsers);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);

  // create form
  const [form, setForm] = useState({
    patientId: '', doctorId: '', therapyId: '',
    receptionistId: '', appointmentDate: '',
    startTime: '', endTime: '', notes: '',
  });

  // edit form — only status and notes can be updated
  const [editForm, setEditForm] = useState({ status: '', notes: '' });

  const set  = key => e => setForm(f     => ({ ...f,     [key]: e.target.value }));
  const setE = key => e => setEditForm(f => ({ ...f,     [key]: e.target.value }));

  const canCreate = ['Admin', 'Receptionist'].includes(role);
  const canEdit   = ['Admin', 'Receptionist', 'Doctor'].includes(role);
  const canDelete = role === 'Admin';

  function openCreate() {
    setForm({ patientId: '', doctorId: '', therapyId: '', receptionistId: '', appointmentDate: '', startTime: '', endTime: '', notes: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setEditForm({ status: row.status, notes: row.notes || '' });
    setModal('edit');
  }

  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal()    { setModal(null); setSelected(null); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createAppointment({
        patientId:       parseInt(form.patientId),
        doctorId:        parseInt(form.doctorId),
        therapyId:       parseInt(form.therapyId),
        receptionistId:  form.receptionistId ? parseInt(form.receptionistId) : null,
        appointmentDate: form.appointmentDate,
        startTime:       form.startTime,
        endTime:         form.endTime,
        notes:           form.notes,
      });
      toast.success('Appointment booked.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateAppointment(selected.appointmentId, editForm);
      toast.success('Appointment updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update appointment.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteAppointment(selected.appointmentId);
      toast.success('Appointment deleted.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete appointment.');
    } finally {
      setSaving(false);
    }
  }

  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;
  const cancelled = appointments.filter(a => a.status === 'Cancelled').length;

  const columns = [
    { key: 'appointmentId',   label: '#' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'therapyName',     label: 'Therapy' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'startTime',       label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status',          label: 'Status', render: v => <Badge label={v} color={appointmentStatusColor(v)} /> },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total"     value={appointments.length} />
        <StatCard label="Scheduled" value={scheduled} color="#2E8CA8" />
        <StatCard label="Completed" value={completed} color="#1D9E75" />
        <StatCard label="Cancelled" value={cancelled} color="#E24B4A" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>All Appointments</h2>
        {canCreate && <Button onClick={openCreate}>+ Book Appointment</Button>}
      </div>

      <DataTable columns={columns} rows={appointments} loading={loading} error={error}
        onEdit={canEdit   ? openEdit   : null}
        onDelete={canDelete ? openDelete : null}
      />

      {modal === 'create' && (
        <Modal title="Book Appointment" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <FieldRow>
              <Field label="Patient" required>
                <Select value={form.patientId} onChange={set('patientId')} required>
                  <option value="">Select patient...</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Doctor" required>
                <Select value={form.doctorId} onChange={set('doctorId')} required>
                  <option value="">Select doctor...</option>
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.fullName}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldRow>
            <FieldRow>
              <Field label="Therapy" required>
                <Select value={form.therapyId} onChange={set('therapyId')} required>
                  <option value="">Select therapy...</option>
                  {therapies.map(t => (
                    <option key={t.therapyId} value={t.therapyId}>
                      {t.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Receptionist">
                <Select value={form.receptionistId} onChange={set('receptionistId')}>
                  <option value="">Select receptionist...</option>
                  {users.filter(u => u.role === 'Receptionist').map(u => (
                    <option key={u.userId} value={u.userId}>
                      {u.firstName} {u.lastName}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldRow>
            <Field label="Date" required>
              <Input type="date" value={form.appointmentDate} onChange={set('appointmentDate')} required />
            </Field>
            <FieldRow>
              <Field label="Start Time" required><Input type="time" value={form.startTime} onChange={set('startTime')} required /></Field>
              <Field label="End Time"   required><Input type="time" value={form.endTime}   onChange={set('endTime')}   required /></Field>
            </FieldRow>
            <Field label="Notes">
              <Textarea value={form.notes} onChange={set('notes')} rows={2} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Booking...' : 'Book Appointment'}</Button>
            </div>
          </form>
        </Modal>
      )}

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

      {modal === 'delete' && (
        <Modal title="Delete Appointment" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Delete appointment <strong>#{selected?.appointmentId}</strong> for <strong>{selected?.patientName}</strong>?
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