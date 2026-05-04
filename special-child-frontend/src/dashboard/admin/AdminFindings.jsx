import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllFindings, createFinding, updateFinding, deleteFinding } from '../../../services/findingService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Field, Input, Textarea } from '../../../components/ui/FormFields';

export default function AdminFindings() {
  const { role } = getSession();
  const { data: findings, loading, error, refetch } = useApi(getAllFindings);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({
    appointmentId:   '',
    observations:    '',
    recommendations: '',
    nextSessionDate: '',
  });

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  // Only Doctor can create/edit, Admin can delete
  const canCreate = role === 'Doctor';
  const canEdit   = role === 'Doctor';
  const canDelete = role === 'Admin';

  function openCreate() {
    setForm({ appointmentId: '', observations: '', recommendations: '', nextSessionDate: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      appointmentId:   row.appointmentId,
      observations:    row.observations    || '',
      recommendations: row.recommendations || '',
      nextSessionDate: row.nextSessionDate || '',
    });
    setModal('edit');
  }

  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal()    { setModal(null); setSelected(null); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createFinding({
        appointmentId:   parseInt(form.appointmentId),
        observations:    form.observations,
        recommendations: form.recommendations,
        nextSessionDate: form.nextSessionDate || null,
      });
      toast.success('Finding added.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to add finding.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateFinding(selected.findingId, {
        observations:    form.observations,
        recommendations: form.recommendations,
        nextSessionDate: form.nextSessionDate || null,
      });
      toast.success('Finding updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update finding.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteFinding(selected.findingId);
      toast.success('Finding deleted.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete finding.');
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'findingId',       label: '#' },
    { key: 'patientName',     label: 'Patient' },
    { key: 'doctorName',      label: 'Doctor' },
    { key: 'observations',    label: 'Observations',    wrap: true },
    { key: 'recommendations', label: 'Recommendations', wrap: true },
    { key: 'nextSessionDate', label: 'Next Session' },
    { key: 'createdAt',       label: 'Date', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Findings"  value={findings.length} />
        <StatCard label="With Follow-up"  value={findings.filter(f => f.nextSessionDate).length} color="#2E8CA8" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>Doctor Findings</h2>
        {canCreate && <Button onClick={openCreate}>+ Add Finding</Button>}
      </div>

      <DataTable columns={columns} rows={findings} loading={loading} error={error}
        onEdit={canEdit   ? openEdit   : null}
        onDelete={canDelete ? openDelete : null}
      />

      {modal === 'create' && (
        <Modal title="Add Session Finding" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <Field label="Appointment ID" required>
              <Input type="number" value={form.appointmentId} onChange={set('appointmentId')} required />
            </Field>
            <Field label="Observations">
              <Textarea value={form.observations} onChange={set('observations')} rows={3} />
            </Field>
            <Field label="Recommendations">
              <Textarea value={form.recommendations} onChange={set('recommendations')} rows={3} />
            </Field>
            <Field label="Next Session Date">
              <Input type="date" value={form.nextSessionDate} onChange={set('nextSessionDate')} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Finding'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Finding" onClose={closeModal}>
          <form onSubmit={handleUpdate}>
            <Field label="Observations">
              <Textarea value={form.observations} onChange={set('observations')} rows={3} />
            </Field>
            <Field label="Recommendations">
              <Textarea value={form.recommendations} onChange={set('recommendations')} rows={3} />
            </Field>
            <Field label="Next Session Date">
              <Input type="date" value={form.nextSessionDate} onChange={set('nextSessionDate')} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Finding" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Delete finding <strong>#{selected?.findingId}</strong> for <strong>{selected?.patientName}</strong>?
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