import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from '../../../services/doctorService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Field, Input, Textarea, FieldRow } from '../../../components/ui/FormFields';

export default function AdminDoctors() {
  const { role } = getSession();
  const { data: doctors, loading, error, refetch } = useApi(getAllDoctors);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({
    userId:         '',
    specialization: '',
    bio:            '',
    availableDays:  '',
    startTime:      '',
    endTime:        '',
  });

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  // Only Admin can create/delete, Admin+Doctor can edit
  const canCreate = role === 'Admin';
  const canEdit   = ['Admin', 'Doctor'].includes(role);

  function openCreate() {
    setForm({ userId: '', specialization: '', bio: '', availableDays: '', startTime: '', endTime: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      specialization: row.specialization || '',
      bio:            row.bio            || '',
      availableDays:  row.availableDays  || '',
      startTime:      row.startTime      || '',
      endTime:        row.endTime        || '',
    });
    setModal('edit');
  }

  function openDelete(row) {
    setSelected(row);
    setModal('delete');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createDoctor({ ...form, userId: parseInt(form.userId) });
      toast.success('Doctor profile created.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to create doctor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateDoctor(selected.doctorId, {
        specialization: form.specialization,
        bio:            form.bio,
        availableDays:  form.availableDays,
        startTime:      form.startTime || null,
        endTime:        form.endTime   || null,
      });
      toast.success('Doctor updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update doctor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteDoctor(selected.doctorId);
      toast.success('Doctor removed.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete doctor.');
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'doctorId',       label: 'ID' },
    { key: 'fullName',       label: 'Name' },
    { key: 'email',          label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'availableDays',  label: 'Available Days' },
    {
      key: 'startTime',
      label: 'Hours',
      render: (_, r) => r.startTime && r.endTime
        ? `${r.startTime} – ${r.endTime}`
        : '—',
    },
  ];

  // Count unique specializations for stat card
  const uniqueSpecs = new Set(
    doctors.map(d => d.specialization).filter(Boolean)
  ).size;

  return (
    <div>
      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <StatCard label="Total Doctors"   value={doctors.length} sub="Registered physicians" />
        <StatCard label="Specializations" value={uniqueSpecs}    sub="Unique specialties" color="#2E8CA8" />
      </div>

      {/* Table header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>All Doctors</h2>
        {canCreate && <Button onClick={openCreate}>+ Add Doctor</Button>}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={doctors}
        loading={loading}
        error={error}
        onEdit={canEdit   ? openEdit   : null}
        onDelete={canCreate ? openDelete : null}
      />

      {/* Create modal */}
      {modal === 'create' && (
        <Modal title="Add Doctor Profile" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <Field label="User ID" required>
              {/* Must be an existing user with Doctor role */}
              <Input type="number" value={form.userId} onChange={set('userId')} required />
            </Field>
            <Field label="Specialization">
              <Input value={form.specialization} onChange={set('specialization')} placeholder="e.g. Speech Therapy" />
            </Field>
            <Field label="Bio">
              <Textarea value={form.bio} onChange={set('bio')} rows={3} />
            </Field>
            <Field label="Available Days">
              <Input value={form.availableDays} onChange={set('availableDays')} placeholder="e.g. Mon, Wed, Fri" />
            </Field>
            <FieldRow>
              <Field label="Start Time">
                <Input type="time" value={form.startTime} onChange={set('startTime')} />
              </Field>
              <Field label="End Time">
                <Input type="time" value={form.endTime} onChange={set('endTime')} />
              </Field>
            </FieldRow>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Add Doctor'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit modal */}
      {modal === 'edit' && (
        <Modal title="Edit Doctor" onClose={closeModal}>
          <form onSubmit={handleUpdate}>
            <Field label="Specialization">
              <Input value={form.specialization} onChange={set('specialization')} />
            </Field>
            <Field label="Bio">
              <Textarea value={form.bio} onChange={set('bio')} rows={3} />
            </Field>
            <Field label="Available Days">
              <Input value={form.availableDays} onChange={set('availableDays')} />
            </Field>
            <FieldRow>
              <Field label="Start Time">
                <Input type="time" value={form.startTime} onChange={set('startTime')} />
              </Field>
              <Field label="End Time">
                <Input type="time" value={form.endTime} onChange={set('endTime')} />
              </Field>
            </FieldRow>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete modal */}
      {modal === 'delete' && (
        <Modal title="Remove Doctor" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Remove <strong>{selected?.fullName}</strong> from the system?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={saving}>
              {saving ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}