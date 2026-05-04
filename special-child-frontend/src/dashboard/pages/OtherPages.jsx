import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { patientsApi, appointmentsApi, slotsApi, paymentsApi, findingsApi, therapiesApi } from '../../services/api';
import { StatCard, DataTable, Badge, Modal, Field, Input, Select, Textarea, SectionHeader, ActionButton, Alert } from '../../../src/dashboard/DashboardComponents';
import { getSession } from '../../services/api';

const GENDERS = ['Male', 'Female', 'Other'];

export function PatientsPage() {
  const { role } = getSession();
  const { data: patients, loading, error, refetch } = useApi(patientsApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ guardianId: '', firstName: '', lastName: '', dateOfBirth: '', gender: '', medicalHistory: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const canWrite = ['Admin', 'Receptionist'].includes(role);

  function openCreate() { setForm({ guardianId: '', firstName: '', lastName: '', dateOfBirth: '', gender: '', medicalHistory: '' }); setApiError(''); setModal('create'); }
  function openEdit(row) { setSelected(row); setForm({ firstName: row.firstName, lastName: row.lastName, dateOfBirth: row.dateOfBirth, gender: row.gender, medicalHistory: row.medicalHistory || '' }); setApiError(''); setModal('edit'); }
  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await patientsApi.create({ ...form, guardianId: parseInt(form.guardianId) }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await patientsApi.update(selected.patientId, form); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await patientsApi.delete(selected.patientId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  const columns = [
    { key: 'patientId',    label: 'ID' },
    { key: 'firstName',    label: 'Name', render: (_, r) => `${r.firstName} ${r.lastName}` },
    { key: 'dateOfBirth',  label: 'DOB' },
    { key: 'gender',       label: 'Gender' },
    { key: 'guardianName', label: 'Guardian' },
    { key: 'createdAt',    label: 'Registered', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Patients" value={patients.length} sub="Under care" />
        <StatCard label="Male"   value={patients.filter(p => p.gender === 'Male').length}   color="#2E8CA8" />
        <StatCard label="Female" value={patients.filter(p => p.gender === 'Female').length} color="#D4537E" />
      </div>
      <SectionHeader title="All Patients" action={canWrite && <ActionButton onClick={openCreate}>+ Add Patient</ActionButton>} />
      <DataTable columns={columns} rows={patients} loading={loading} error={error} onEdit={canWrite ? openEdit : null} onDelete={canWrite ? openDelete : null} />

      {modal === 'create' && (
        <Modal title="Add Patient" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <Field label="Guardian User ID"><Input type="number" value={form.guardianId} onChange={set('guardianId')} required /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="First Name"><Input value={form.firstName} onChange={set('firstName')} required /></Field>
              <Field label="Last Name"><Input value={form.lastName} onChange={set('lastName')} required /></Field>
            </div>
            <Field label="Date of Birth"><Input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} required /></Field>
            <Field label="Gender"><Select value={form.gender} onChange={set('gender')} required><option value="">Select…</option>{GENDERS.map(g => <option key={g}>{g}</option>)}</Select></Field>
            <Field label="Medical History"><Textarea value={form.medicalHistory} onChange={set('medicalHistory')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Add Patient'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Patient" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="First Name"><Input value={form.firstName} onChange={set('firstName')} /></Field>
              <Field label="Last Name"><Input value={form.lastName} onChange={set('lastName')} /></Field>
            </div>
            <Field label="Date of Birth"><Input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} /></Field>
            <Field label="Gender"><Select value={form.gender} onChange={set('gender')}><option value="">Select…</option>{GENDERS.map(g => <option key={g}>{g}</option>)}</Select></Field>
            <Field label="Medical History"><Textarea value={form.medicalHistory} onChange={set('medicalHistory')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Save'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Patient" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>Delete <strong>{selected?.firstName} {selected?.lastName}</strong>?</p>
          {apiError && <Alert>{apiError}</Alert>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
            <ActionButton variant="danger" onClick={handleDelete}>{saving ? 'Deleting…' : 'Delete'}</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── AppointmentsPage
const STATUSES = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

export function AppointmentsPage() {
  const { role } = getSession();
  const { data: appointments, loading, error, refetch } = useApi(appointmentsApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ patientId: '', doctorId: '', therapyId: '', receptionistId: '', appointmentDate: '', startTime: '', endTime: '', notes: '' });
  const [editForm, setEditForm] = useState({ status: '', notes: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setE = k => e => setEditForm(f => ({ ...f, [k]: e.target.value }));
  const canCreate = ['Admin', 'Receptionist'].includes(role);
  const canEdit   = ['Admin', 'Receptionist', 'Doctor'].includes(role);
  const canDelete = ['Admin'].includes(role);

  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try {
      await appointmentsApi.create({
        patientId: parseInt(form.patientId), doctorId: parseInt(form.doctorId),
        therapyId: parseInt(form.therapyId), receptionistId: parseInt(form.receptionistId),
        appointmentDate: form.appointmentDate, startTime: form.startTime, endTime: form.endTime, notes: form.notes,
      });
      refetch(); closeModal();
    } catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await appointmentsApi.update(selected.appointmentId, editForm); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await appointmentsApi.delete(selected.appointmentId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  const statusColor = s => ({ Scheduled: 'blue', Completed: 'green', Cancelled: 'red', NoShow: 'orange' }[s] || 'gray');

  const columns = [
    { key: 'appointmentId',   label: 'ID' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'therapyName',     label: 'Therapy' },
    { key: 'appointmentDate', label: 'Date' },
    { key: 'startTime',       label: 'Time', render: (_, r) => `${r.startTime} – ${r.endTime}` },
    { key: 'status',          label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
  ];

  const scheduled  = appointments.filter(a => a.status === 'Scheduled').length;
  const completed  = appointments.filter(a => a.status === 'Completed').length;
  const cancelled  = appointments.filter(a => a.status === 'Cancelled').length;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total"     value={appointments.length} />
        <StatCard label="Scheduled" value={scheduled}  color="#2E8CA8" />
        <StatCard label="Completed" value={completed}  color="#1D9E75" />
        <StatCard label="Cancelled" value={cancelled}  color="#E24B4A" />
      </div>
      <SectionHeader title="All Appointments" action={canCreate && <ActionButton onClick={() => { setForm({ patientId:'',doctorId:'',therapyId:'',receptionistId:'',appointmentDate:'',startTime:'',endTime:'',notes:'' }); setApiError(''); setModal('create'); }}>+ Book Appointment</ActionButton>} />
      <DataTable columns={columns} rows={appointments} loading={loading} error={error}
        onEdit={canEdit ? row => { setSelected(row); setEditForm({ status: row.status, notes: row.notes || '' }); setApiError(''); setModal('edit'); } : null}
        onDelete={canDelete ? row => { setSelected(row); setModal('delete'); } : null}
      />

      {modal === 'create' && (
        <Modal title="Book Appointment" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Patient ID"><Input type="number" value={form.patientId} onChange={set('patientId')} required /></Field>
              <Field label="Doctor ID"><Input type="number" value={form.doctorId} onChange={set('doctorId')} required /></Field>
              <Field label="Therapy ID"><Input type="number" value={form.therapyId} onChange={set('therapyId')} required /></Field>
              <Field label="Receptionist ID"><Input type="number" value={form.receptionistId} onChange={set('receptionistId')} required /></Field>
            </div>
            <Field label="Date"><Input type="date" value={form.appointmentDate} onChange={set('appointmentDate')} required /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Start Time"><Input type="time" value={form.startTime} onChange={set('startTime')} required /></Field>
              <Field label="End Time"><Input type="time" value={form.endTime} onChange={set('endTime')} required /></Field>
            </div>
            <Field label="Notes"><Textarea value={form.notes} onChange={set('notes')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Booking…' : 'Book'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Update Appointment" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <Field label="Status"><Select value={editForm.status} onChange={setE('status')}>{STATUSES.map(s => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Notes"><Textarea value={editForm.notes} onChange={setE('notes')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Update'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Cancel Appointment" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>Delete appointment #{selected?.appointmentId}?</p>
          {apiError && <Alert>{apiError}</Alert>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
            <ActionButton variant="danger" onClick={handleDelete}>{saving ? 'Deleting…' : 'Delete'}</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── SlotsPage
export function SlotsPage() {
  const { role } = getSession();
  const { data: slots, loading, error, refetch } = useApi(slotsApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ doctorId: '', date: '', startTime: '', endTime: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const canWrite = ['Admin', 'Doctor'].includes(role);
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await slotsApi.create({ ...form, doctorId: parseInt(form.doctorId) }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await slotsApi.delete(selected.slotId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Slots" value={slots.length} />
        <StatCard label="Available"   value={available}         color="#1D9E75" />
        <StatCard label="Booked"      value={slots.length - available} color="#EF9F27" />
      </div>
      <SectionHeader title="All Slots" action={canWrite && <ActionButton onClick={() => { setForm({ doctorId:'',date:'',startTime:'',endTime:'' }); setApiError(''); setModal('create'); }}>+ Add Slot</ActionButton>} />
      <DataTable columns={columns} rows={slots} loading={loading} error={error} onDelete={canWrite ? row => { setSelected(row); setModal('delete'); } : null} />

      {modal === 'create' && (
        <Modal title="Add Slot" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <Field label="Doctor ID"><Input type="number" value={form.doctorId} onChange={set('doctorId')} required /></Field>
            <Field label="Date"><Input type="date" value={form.date} onChange={set('date')} required /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Start Time"><Input type="time" value={form.startTime} onChange={set('startTime')} required /></Field>
              <Field label="End Time"><Input type="time" value={form.endTime} onChange={set('endTime')} required /></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Add Slot'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Slot" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>Delete slot #{selected?.slotId}?</p>
          {apiError && <Alert>{apiError}</Alert>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
            <ActionButton variant="danger" onClick={handleDelete}>{saving ? 'Deleting…' : 'Delete'}</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PaymentsPage
const PAYMENT_METHODS = ['Cash', 'Card', 'BankTransfer', 'Online'];
const PAYMENT_STATUSES = ['Pending', 'Completed', 'Failed', 'Refunded'];

export function PaymentsPage() {
  const { role } = getSession();
  const { data: payments, loading, error, refetch } = useApi(paymentsApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ appointmentId: '', amount: '', paymentMethod: '', transactionId: '' });
  const [editForm, setEditForm] = useState({ paymentMethod: '', status: '', transactionId: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setE = k => e => setEditForm(f => ({ ...f, [k]: e.target.value }));
  const canWrite = ['Admin', 'Receptionist'].includes(role);
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await paymentsApi.create({ appointmentId: parseInt(form.appointmentId), amount: parseFloat(form.amount), paymentMethod: form.paymentMethod, transactionId: form.transactionId }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await paymentsApi.update(selected.paymentId, editForm); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  const statusColor = s => ({ Completed: 'green', Pending: 'orange', Failed: 'red', Refunded: 'gray' }[s] || 'gray');
  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    { key: 'paymentId',     label: 'ID' },
    { key: 'patientName',   label: 'Patient' },
    { key: 'amount',        label: 'Amount', render: v => `Rs. ${v?.toLocaleString()}` },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'status',        label: 'Status', render: v => <Badge label={v} color={statusColor(v)} /> },
    { key: 'paidAt',        label: 'Paid At', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total"    value={payments.length} />
        <StatCard label="Revenue"  value={`Rs. ${totalRevenue.toLocaleString()}`} color="#1D9E75" />
        <StatCard label="Pending"  value={payments.filter(p => p.status === 'Pending').length}   color="#EF9F27" />
        <StatCard label="Failed"   value={payments.filter(p => p.status === 'Failed').length}    color="#E24B4A" />
      </div>
      <SectionHeader title="All Payments" action={canWrite && <ActionButton onClick={() => { setForm({ appointmentId:'',amount:'',paymentMethod:'',transactionId:'' }); setApiError(''); setModal('create'); }}>+ Add Payment</ActionButton>} />
      <DataTable columns={columns} rows={payments} loading={loading} error={error}
        onEdit={canWrite ? row => { setSelected(row); setEditForm({ paymentMethod: row.paymentMethod||'', status: row.status, transactionId: row.transactionId||'' }); setApiError(''); setModal('edit'); } : null}
      />

      {modal === 'create' && (
        <Modal title="Add Payment" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <Field label="Appointment ID"><Input type="number" value={form.appointmentId} onChange={set('appointmentId')} required /></Field>
            <Field label="Amount (Rs.)"><Input type="number" step="0.01" value={form.amount} onChange={set('amount')} required /></Field>
            <Field label="Payment Method"><Select value={form.paymentMethod} onChange={set('paymentMethod')}><option value="">Select…</option>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</Select></Field>
            <Field label="Transaction ID"><Input value={form.transactionId} onChange={set('transactionId')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Add Payment'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Update Payment" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <Field label="Payment Method"><Select value={editForm.paymentMethod} onChange={setE('paymentMethod')}>{PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}</Select></Field>
            <Field label="Status"><Select value={editForm.status} onChange={setE('status')}>{PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Transaction ID"><Input value={editForm.transactionId} onChange={setE('transactionId')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Update'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── FindingsPage
export function FindingsPage() {
  const { role } = getSession();
  const { data: findings, loading, error, refetch } = useApi(findingsApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ appointmentId: '', observations: '', recommendations: '', nextSessionDate: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const canCreate = ['Doctor'].includes(role);
  const canEdit   = ['Doctor'].includes(role);
  const canDelete = ['Admin'].includes(role);
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await findingsApi.create({ appointmentId: parseInt(form.appointmentId), observations: form.observations, recommendations: form.recommendations, nextSessionDate: form.nextSessionDate || null }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await findingsApi.update(selected.findingId, { observations: form.observations, recommendations: form.recommendations, nextSessionDate: form.nextSessionDate || null }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await findingsApi.delete(selected.findingId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  const columns = [
    { key: 'findingId',       label: 'ID' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'observations',    label: 'Observations',    wrap: true },
    { key: 'recommendations', label: 'Recommendations', wrap: true },
    { key: 'nextSessionDate', label: 'Next Session' },
    { key: 'createdAt',       label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Findings" value={findings.length} />
        <StatCard label="With Follow-up" value={findings.filter(f => f.nextSessionDate).length} color="#2E8CA8" />
      </div>
      <SectionHeader title="Doctor Findings" action={canCreate && <ActionButton onClick={() => { setForm({ appointmentId:'',observations:'',recommendations:'',nextSessionDate:'' }); setApiError(''); setModal('create'); }}>+ Add Finding</ActionButton>} />
      <DataTable columns={columns} rows={findings} loading={loading} error={error}
        onEdit={canEdit ? row => { setSelected(row); setForm({ appointmentId: row.appointmentId, observations: row.observations||'', recommendations: row.recommendations||'', nextSessionDate: row.nextSessionDate||'' }); setApiError(''); setModal('edit'); } : null}
        onDelete={canDelete ? row => { setSelected(row); setModal('delete'); } : null}
      />

      {modal === 'create' && (
        <Modal title="Add Finding" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <Field label="Appointment ID"><Input type="number" value={form.appointmentId} onChange={set('appointmentId')} required /></Field>
            <Field label="Observations"><Textarea value={form.observations} onChange={set('observations')} /></Field>
            <Field label="Recommendations"><Textarea value={form.recommendations} onChange={set('recommendations')} /></Field>
            <Field label="Next Session Date"><Input type="date" value={form.nextSessionDate} onChange={set('nextSessionDate')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Add Finding'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Finding" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <Field label="Observations"><Textarea value={form.observations} onChange={set('observations')} /></Field>
            <Field label="Recommendations"><Textarea value={form.recommendations} onChange={set('recommendations')} /></Field>
            <Field label="Next Session Date"><Input type="date" value={form.nextSessionDate} onChange={set('nextSessionDate')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Save'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Finding" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>Delete finding #{selected?.findingId}?</p>
          {apiError && <Alert>{apiError}</Alert>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
            <ActionButton variant="danger" onClick={handleDelete}>{saving ? 'Deleting…' : 'Delete'}</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── TherapiesPage
export function TherapiesPage() {
  const { role } = getSession();
  const { data: therapies, loading, error, refetch } = useApi(therapiesApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ name: '', description: '', durationMinutes: '', cost: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const canWrite = ['Admin'].includes(role);
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await therapiesApi.create({ name: form.name, description: form.description, durationMinutes: parseInt(form.durationMinutes), cost: parseFloat(form.cost) }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await therapiesApi.update(selected.therapyId, { name: form.name, description: form.description, durationMinutes: parseInt(form.durationMinutes), cost: parseFloat(form.cost) }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await therapiesApi.delete(selected.therapyId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed.'); }
    finally { setSaving(false); }
  }

  const avgCost = therapies.length ? (therapies.reduce((s, t) => s + t.cost, 0) / therapies.length).toFixed(0) : 0;

  const columns = [
    { key: 'therapyId',        label: 'ID' },
    { key: 'name',             label: 'Name' },
    { key: 'description',      label: 'Description', wrap: true },
    { key: 'durationMinutes',  label: 'Duration', render: v => `${v} min` },
    { key: 'cost',             label: 'Cost', render: v => `Rs. ${v?.toLocaleString()}` },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Therapies" value={therapies.length} />
        <StatCard label="Avg. Cost"       value={`Rs. ${avgCost}`}  color="#2E8CA8" />
        <StatCard label="Avg. Duration"   value={therapies.length ? `${Math.round(therapies.reduce((s,t) => s+t.durationMinutes,0)/therapies.length)} min` : '—'} color="#1D9E75" />
      </div>
      <SectionHeader title="All Therapies" action={canWrite && <ActionButton onClick={() => { setForm({ name:'',description:'',durationMinutes:'',cost:'' }); setApiError(''); setModal('create'); }}>+ Add Therapy</ActionButton>} />
      <DataTable columns={columns} rows={therapies} loading={loading} error={error} onEdit={canWrite ? row => { setSelected(row); setForm({ name: row.name, description: row.description||'', durationMinutes: row.durationMinutes, cost: row.cost }); setApiError(''); setModal('edit'); } : null} onDelete={canWrite ? row => { setSelected(row); setModal('delete'); } : null} />

      {modal === 'create' && (
        <Modal title="Add Therapy" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <Field label="Name"><Input value={form.name} onChange={set('name')} required /></Field>
            <Field label="Description"><Textarea value={form.description} onChange={set('description')} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Duration (min)"><Input type="number" value={form.durationMinutes} onChange={set('durationMinutes')} required /></Field>
              <Field label="Cost (Rs.)"><Input type="number" step="0.01" value={form.cost} onChange={set('cost')} required /></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Add Therapy'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Therapy" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <Field label="Name"><Input value={form.name} onChange={set('name')} /></Field>
            <Field label="Description"><Textarea value={form.description} onChange={set('description')} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Duration (min)"><Input type="number" value={form.durationMinutes} onChange={set('durationMinutes')} /></Field>
              <Field label="Cost (Rs.)"><Input type="number" step="0.01" value={form.cost} onChange={set('cost')} /></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Save'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Therapy" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>Delete <strong>{selected?.name}</strong>?</p>
          {apiError && <Alert>{apiError}</Alert>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
            <ActionButton variant="danger" onClick={handleDelete}>{saving ? 'Deleting…' : 'Delete'}</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

