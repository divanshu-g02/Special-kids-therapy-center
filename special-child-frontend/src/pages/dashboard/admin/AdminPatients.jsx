import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllPatients, createPatient, updatePatient, deletePatient } from '../../../services/patientService';
import { getAllUsers } from '../../../services/userService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, Textarea, FieldRow } from '../../../components/ui/FormFields';

const GENDERS = ['Male', 'Female', 'Other'];

export default function AdminPatients() {
  const { role } = getSession();
  const { data: patients, loading, error, refetch } = useApi(getAllPatients);
  const { data: users = [] } = useApi(getAllUsers);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({
    guardianId:     '',
    firstName:      '',
    lastName:       '',
    dateOfBirth:    '',
    gender:         '',
    medicalHistory: '',
  });

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const canWrite = ['Admin', 'Receptionist'].includes(role);

  function openCreate() {
    setForm({ guardianId: '', firstName: '', lastName: '', dateOfBirth: '', gender: '', medicalHistory: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      firstName:      row.firstName,
      lastName:       row.lastName,
      dateOfBirth:    row.dateOfBirth    || '',
      gender:         row.gender,
      medicalHistory: row.medicalHistory || '',
      guardianId:     row.guardianId     || '',
    });
    setModal('edit');
  }

  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal()    { setModal(null); setSelected(null); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createPatient({ ...form, guardianId: form.guardianId ? parseInt(form.guardianId) : null });
      toast.success('Patient added.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to add patient.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePatient(selected.patientId, form);
      toast.success('Patient updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update patient.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deletePatient(selected.patientId);
      toast.success('Patient deleted.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete patient.');
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'patientId',   label: 'ID' },
    { key: 'firstName',   label: 'Name',       render: (_, r) => `${r.firstName} ${r.lastName}` },
    { key: 'dateOfBirth', label: 'DOB' },
    { key: 'gender',      label: 'Gender',     render: v => <Badge label={v} color={v === 'Male' ? 'blue' : v === 'Female' ? 'purple' : 'gray'} /> },
    { key: 'guardianName',label: 'Guardian' },
    { key: 'createdAt',   label: 'Registered', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total Patients" value={patients.length} sub="Under care" />
        <StatCard label="Male"   value={patients.filter(p => p.gender === 'Male').length}   color="#2E8CA8" />
        <StatCard label="Female" value={patients.filter(p => p.gender === 'Female').length} color="#D4537E" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>All Patients</h2>
        {canWrite && <Button onClick={openCreate}>+ Add Patient</Button>}
      </div>

      <DataTable columns={columns} rows={patients} loading={loading} error={error}
        onEdit={canWrite ? openEdit : null}
        onDelete={canWrite ? openDelete : null}
      />

      {modal === 'create' && (
        <Modal title="Add Patient" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <Field label="Guardian">
              <Select value={form.guardianId} onChange={set('guardianId')}>
                <option value="">Select guardian (optional)...</option>
                {users.filter(u => u.role === 'Guardian').map(u => (
                  <option key={u.userId} value={u.userId}>
                    {u.firstName} {u.lastName} — {u.email}
                  </option>
                ))}
              </Select>
            </Field>
            <FieldRow>
              <Field label="First Name" required>
                <Input value={form.firstName} onChange={set('firstName')} required />
              </Field>
              <Field label="Last Name" required>
                <Input value={form.lastName} onChange={set('lastName')} required />
              </Field>
            </FieldRow>
            <FieldRow>
              <Field label="Date of Birth" required>
                <Input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} required />
              </Field>
              <Field label="Gender" required>
                <Select value={form.gender} onChange={set('gender')} required>
                  <option value="">Select...</option>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </Select>
              </Field>
            </FieldRow>
            <Field label="Medical History">
              <Textarea value={form.medicalHistory} onChange={set('medicalHistory')} rows={3} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Patient'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Edit Patient" onClose={closeModal}>
          <form onSubmit={handleUpdate}>
            <FieldRow>
              <Field label="First Name">
                <Input value={form.firstName} onChange={set('firstName')} />
              </Field>
              <Field label="Last Name">
                <Input value={form.lastName} onChange={set('lastName')} />
              </Field>
            </FieldRow>
            <FieldRow>
              <Field label="Date of Birth">
                <Input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
              </Field>
              <Field label="Gender">
                <Select value={form.gender} onChange={set('gender')}>
                  <option value="">Select...</option>
                  {GENDERS.map(g => <option key={g}>{g}</option>)}
                </Select>
              </Field>
            </FieldRow>
            <Field label="Medical History">
              <Textarea value={form.medicalHistory} onChange={set('medicalHistory')} rows={3} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Patient" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Delete <strong>{selected?.firstName} {selected?.lastName}</strong>? This cannot be undone.
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