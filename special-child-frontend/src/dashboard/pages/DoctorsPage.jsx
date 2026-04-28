import React, { useState } from 'react';
import { useApi } from '../../../src/dashboard/useApi';
import { doctorsApi } from '../../services/apiService';
import { StatCard, DataTable, Modal, Field, Input, Textarea, SectionHeader, ActionButton, Alert } from '../../../src/dashboard/DashboardComponents';
import { getSession } from '../../services/authService';

export default function DoctorsPage() {
  const { role } = getSession();
  const { data: doctors, loading, error, refetch } = useApi(doctorsApi.getAll);
  const [modal, setModal]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm]         = useState({ userId: '', specialization: '', bio: '', availableDays: '', startTime: '', endTime: '' });
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const canEdit = ['Admin'].includes(role);

  function openCreate() { setForm({ userId: '', specialization: '', bio: '', availableDays: '', startTime: '', endTime: '' }); setApiError(''); setModal('create'); }
  function openEdit(row) { setSelected(row); setForm({ specialization: row.specialization || '', bio: row.bio || '', availableDays: row.availableDays || '', startTime: row.startTime || '', endTime: row.endTime || '' }); setApiError(''); setModal('edit'); }
  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await doctorsApi.create({ ...form, userId: parseInt(form.userId) }); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed to create doctor.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault(); setSaving(true); setApiError('');
    try { await doctorsApi.update(selected.doctorId, form); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed to update doctor.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await doctorsApi.delete(selected.doctorId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed to delete doctor.'); }
    finally { setSaving(false); }
  }

  const columns = [
    { key: 'doctorId',       label: 'ID' },
    { key: 'fullName',       label: 'Name' },
    { key: 'email',          label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'availableDays',  label: 'Available Days' },
    { key: 'startTime',      label: 'Hours', render: (_, r) => r.startTime && r.endTime ? `${r.startTime} – ${r.endTime}` : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Doctors"   value={doctors.length} sub="Registered physicians" />
        <StatCard label="Specializations" value={new Set(doctors.map(d => d.specialization).filter(Boolean)).size} sub="Unique specialties" color="#2E8CA8" />
      </div>

      <SectionHeader title="All Doctors" action={canEdit && <ActionButton onClick={openCreate}>+ Add Doctor</ActionButton>} />
      <DataTable columns={columns} rows={doctors} loading={loading} error={error}
        onEdit={canEdit ? openEdit : null}
        onDelete={canEdit ? openDelete : null}
      />

      {modal === 'create' && (
        <Modal title="Add Doctor Profile" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <Field label="User ID (existing user)"><Input type="number" value={form.userId} onChange={set('userId')} required /></Field>
            <Field label="Specialization"><Input value={form.specialization} onChange={set('specialization')} /></Field>
            <Field label="Bio"><Textarea value={form.bio} onChange={set('bio')} /></Field>
            <Field label="Available Days (e.g. Mon,Wed,Fri)"><Input value={form.availableDays} onChange={set('availableDays')} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Start Time"><Input type="time" value={form.startTime} onChange={set('startTime')} /></Field>
              <Field label="End Time"><Input type="time" value={form.endTime} onChange={set('endTime')} /></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Add Doctor'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Doctor" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <Field label="Specialization"><Input value={form.specialization} onChange={set('specialization')} /></Field>
            <Field label="Bio"><Textarea value={form.bio} onChange={set('bio')} /></Field>
            <Field label="Available Days"><Input value={form.availableDays} onChange={set('availableDays')} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="Start Time"><Input type="time" value={form.startTime} onChange={set('startTime')} /></Field>
              <Field label="End Time"><Input type="time" value={form.endTime} onChange={set('endTime')} /></Field>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Save Changes'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Remove Doctor" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>Remove <strong>{selected?.fullName}</strong> from the system?</p>
          {apiError && <Alert>{apiError}</Alert>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
            <ActionButton variant="danger" onClick={handleDelete}>{saving ? 'Removing…' : 'Remove'}</ActionButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
