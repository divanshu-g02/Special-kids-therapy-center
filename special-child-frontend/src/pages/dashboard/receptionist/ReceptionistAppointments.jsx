import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';

import {
  getAllAppointments,
  createAppointment,
  updateAppointment
} from '../../../services/appointmentService';

import { getAllPatients } from '../../../services/patientService';
import { getAllDoctors } from '../../../services/doctorService';
import { getAllTherapies } from '../../../services/therapyService';

import { getSession } from '../../../services/authService';

import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, Textarea, FieldRow } from '../../../components/ui/FormFields';

const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

function statusColor(s) {
  return { Scheduled:'blue', Completed:'green', Cancelled:'red', NoShow:'orange' }[s] || 'gray';
}

export default function ReceptionistAppointments() {

  // ✅ main data
  const { data: appointments = [], loading, error, refetch } = useApi(getAllAppointments);

  // ✅ dropdown data
  const { data: patients = [] }  = useApi(getAllPatients);
  const { data: doctors = [] }   = useApi(getAllDoctors);
  const { data: therapies = [] } = useApi(getAllTherapies);

  // ✅ logged in user
  const session = getSession();

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    therapyId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    notes: '',
  });

  const [editForm, setEditForm] = useState({ status: '', notes: '' });

  const set  = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const setE = key => e => setEditForm(f => ({ ...f, [key]: e.target.value }));

  function openCreate() {
    setForm({
      patientId: '',
      doctorId: '',
      therapyId: '',
      appointmentDate: '',
      startTime: '',
      endTime: '',
      notes: '',
    });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setEditForm({ status: row.status, notes: row.notes || '' });
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await createAppointment({
        patientId: parseInt(form.patientId),
        doctorId: parseInt(form.doctorId),
        therapyId: parseInt(form.therapyId),

        // ✅ AUTO receptionist using logged-in user's ID
        receptionistId: parseInt(session.userId || 0),

        appointmentDate: form.appointmentDate,
        startTime: form.startTime,
        endTime: form.endTime,
        notes: form.notes,
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
      toast.error(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'appointmentId', label: '#' },
    { key: 'patientName', label: 'Patient' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'startTime', label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status', label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
  ];

  return (
    <div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total" value={appointments.length} />
        <StatCard label="Scheduled" value={appointments.filter(a => a.status === 'Scheduled').length} color="#2E8CA8" />
        <StatCard label="Completed" value={appointments.filter(a => a.status === 'Completed').length} color="#1D9E75" />
        <StatCard label="Cancelled" value={appointments.filter(a => a.status === 'Cancelled').length} color="#E24B4A" />
      </div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2>Appointments</h2>
        <Button onClick={openCreate}>+ Book Appointment</Button>
      </div>

      <DataTable columns={columns} rows={appointments} loading={loading} error={error} onEdit={openEdit} />

      {/* CREATE MODAL */}
      {modal === 'create' && (
        <Modal title="Book Appointment" onClose={closeModal}>
          <form onSubmit={handleCreate}>

            <FieldRow>
              <Field label="Patient" required>
                <Select value={form.patientId} onChange={set('patientId')} required>
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.firstName} {p.lastName}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Doctor" required>
                <Select value={form.doctorId} onChange={set('doctorId')} required>
                  <option value="">Select Doctor</option>
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.firstName} {d.lastName}
                    </option>
                  ))}
                </Select>
              </Field>
            </FieldRow>

            <Field label="Therapy" required>
              <Select value={form.therapyId} onChange={set('therapyId')} required>
                <option value="">Select Therapy</option>
                {therapies.map(t => (
                  <option key={t.therapyId} value={t.therapyId}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Date" required>
              <Input type="date" value={form.appointmentDate} onChange={set('appointmentDate')} required />
            </Field>

            <FieldRow>
              <Field label="Start Time" required>
                <Input type="time" value={form.startTime} onChange={set('startTime')} required />
              </Field>
              <Field label="End Time" required>
                <Input type="time" value={form.endTime} onChange={set('endTime')} required />
              </Field>
            </FieldRow>

            <Field label="Notes">
              <Textarea value={form.notes} onChange={set('notes')} rows={2} />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>

          </form>
        </Modal>
      )}

      {/* EDIT MODAL (unchanged) */}
      {modal === 'edit' && (
        <Modal title="Update Appointment" onClose={closeModal}>
          <form onSubmit={handleUpdate}>
            <Field label="Status">
              <Select value={editForm.status} onChange={setE('status')}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </Field>

            <Field label="Notes">
              <Textarea value={editForm.notes} onChange={setE('notes')} />
            </Field>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}