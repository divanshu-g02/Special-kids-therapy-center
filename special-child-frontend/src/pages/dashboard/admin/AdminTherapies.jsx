// src/pages/admin/AdminTherapies.jsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllTherapies, createTherapy, updateTherapy, deleteTherapy } from '../../../services/therapyService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Textarea, FieldRow } from '../../../components/ui/FormFields';

export default function AdminTherapies() {
  const { role } = getSession();
  const { data: therapies, loading, error, refetch } = useApi(getAllTherapies);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({
    name:            '',
    description:     '',
    durationMinutes: '',
    cost:            '',
  });

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const canWrite = role === 'Admin';

  function openCreate() {
    setForm({ name: '', description: '', durationMinutes: '', cost: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      name:            row.name,
      description:     row.description     || '',
      durationMinutes: row.durationMinutes,
      cost:            row.cost,
    });
    setModal('edit');
  }

  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal()    { setModal(null); setSelected(null); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createTherapy({
        name:            form.name,
        description:     form.description,
        durationMinutes: parseInt(form.durationMinutes),
        cost:            parseFloat(form.cost),
      });
      toast.success('Therapy added.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to add therapy.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTherapy(selected.therapyId, {
        name:            form.name,
        description:     form.description,
        durationMinutes: parseInt(form.durationMinutes),
        cost:            parseFloat(form.cost),
      });
      toast.success('Therapy updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update therapy.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteTherapy(selected.therapyId);
      toast.success('Therapy deleted.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete therapy.');
    } finally {
      setSaving(false);
    }
  }

  const avgCost = therapies.length
    ? Math.round(therapies.reduce((s, t) => s + t.cost, 0) / therapies.length)
    : 0;

  const avgDuration = therapies.length
    ? Math.round(therapies.reduce((s, t) => s + t.durationMinutes, 0) / therapies.length)
    : 0;

  const columns = [
    { key: 'therapyId',       label: 'ID' },
    { key: 'name',            label: 'Name' },
    { key: 'description',     label: 'Description',  wrap: true },
    { key: 'durationMinutes', label: 'Duration',     render: v => `${v} min` },
    { key: 'cost',            label: 'Cost',         render: v => `Rs. ${v?.toLocaleString()}` },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Therapies" value={therapies.length} />
        <StatCard label="Avg. Cost"       value={`Rs. ${avgCost}`}      color="#2E8CA8" />
        <StatCard label="Avg. Duration"   value={`${avgDuration} min`}  color="#1D9E75" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>All Therapies</h2>
        {canWrite && <Button onClick={openCreate}>+ Add Therapy</Button>}
      </div>

      <DataTable columns={columns} rows={therapies} loading={loading} error={error}
        onEdit={canWrite ? openEdit : null}
        onDelete={canWrite ? openDelete : null}
      />

      {modal === 'create' && (
        <Modal title="Add Therapy" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <Field label="Name" required>
              <Input value={form.name} onChange={set('name')} required />
            </Field>
            <Field label="Description">
              <Textarea value={form.description} onChange={set('description')} rows={3} />
            </Field>
            <FieldRow>
              <Field label="Duration (min)" required>
                <Input type="number" value={form.durationMinutes} onChange={set('durationMinutes')} required />
              </Field>
              <Field label="Cost (Rs.)" required>
                <Input type="number" step="0.01" value={form.cost} onChange={set('cost')} required />
              </Field>
            </FieldRow>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Therapy'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Therapy" onClose={closeModal}>
          <form onSubmit={handleUpdate}>
            <Field label="Name">
              <Input value={form.name} onChange={set('name')} />
            </Field>
            <Field label="Description">
              <Textarea value={form.description} onChange={set('description')} rows={3} />
            </Field>
            <FieldRow>
              <Field label="Duration (min)">
                <Input type="number" value={form.durationMinutes} onChange={set('durationMinutes')} />
              </Field>
              <Field label="Cost (Rs.)">
                <Input type="number" step="0.01" value={form.cost} onChange={set('cost')} />
              </Field>
            </FieldRow>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Therapy" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Delete therapy <strong>{selected?.name}</strong>? This cannot be undone.
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