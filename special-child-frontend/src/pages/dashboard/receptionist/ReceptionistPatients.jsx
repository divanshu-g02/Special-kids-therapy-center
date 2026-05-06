import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';

import { getAllPatients, createPatient, updatePatient } from '../../../services/patientService';
import { getAllUsers } from '../../../services/userService';

import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, Textarea, FieldRow } from '../../../components/ui/FormFields';

const GENDERS = ['Male', 'Female', 'Other'];

export default function ReceptionistPatients() {

  const { data: patients = [], loading, error, refetch } = useApi(getAllPatients);

  // ✅ Fetch all users (we'll filter guardians)
  const { data: users = [] } = useApi(getAllUsers);

  // ✅ Filter only guardians (role = 5)
  const guardians = users.filter(u => u.role === 5);

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    guardianId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
  });

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const filtered = patients.filter(p =>
    `${p.firstName} ${p.lastName} ${p.guardianName || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function openCreate() {
    setForm({
      guardianId: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      medicalHistory: '',
    });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      firstName: row.firstName,
      lastName: row.lastName,
      dateOfBirth: row.dateOfBirth || '',
      gender: row.gender,
      medicalHistory: row.medicalHistory || '',
      guardianId: row.guardianId || '',
    });
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
      await createPatient({
        ...form,
        guardianId: form.guardianId ? parseInt(form.guardianId) : null
      });

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
      await updatePatient(selected.patientId, {
        ...form,
        guardianId: form.guardianId ? parseInt(form.guardianId) : null
      });

      toast.success('Patient updated.');
      refetch();
      closeModal();

    } catch (err) {
      toast.error(err.message || 'Failed to update patient.');
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    { key: 'patientId', label: 'ID' },
    {
      key: 'firstName',
      label: 'Name',
      render: (_, r) => `${r.firstName} ${r.lastName}`
    },
    { key: 'dateOfBirth', label: 'DOB' },
    {
      key: 'gender',
      label: 'Gender',
      render: v => <Badge label={v} color={v === 'Male' ? 'blue' : 'purple'} />
    },
    { key: 'guardianName', label: 'Guardian' },
  ];

  return (
    <div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total Patients" value={patients.length} />
        <StatCard label="Male" value={patients.filter(p => p.gender === 'Male').length} color="#2E8CA8" />
        <StatCard label="Female" value={patients.filter(p => p.gender === 'Female').length} color="#D4537E" />
      </div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h2>Patients</h2>
        <Button onClick={openCreate}>+ Add Patient</Button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or guardian..."
        style={{
          width: '280px',
          height: '36px',
          border: '0.5px solid rgba(0,0,0,0.18)',
          borderRadius: '8px',
          padding: '0 12px',
          marginBottom: '16px'
        }}
      />

      <DataTable columns={columns} rows={filtered} loading={loading} error={error} onEdit={openEdit} />

      {/* CREATE */}
      {modal === 'create' && (
        <Modal title="Add Patient" onClose={closeModal}>
          <form onSubmit={handleCreate}>

            {/* ✅ Guardian Dropdown */}
            <Field label="Guardian">
              <Select value={form.guardianId} onChange={set('guardianId')}>
                <option value="">Select Guardian (optional)</option>
                {guardians.map(g => (
                  <option key={g.userId} value={g.userId}>
                    {g.firstName} {g.lastName}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Add Patient'}
              </Button>
            </div>

          </form>
        </Modal>
      )}

      {/* EDIT */}
      {modal === 'edit' && (
        <Modal title="Edit Patient" onClose={closeModal}>
          <form onSubmit={handleUpdate}>

            {/* ✅ Guardian Dropdown in edit */}
            <Field label="Guardian">
              <Select value={form.guardianId} onChange={set('guardianId')}>
                <option value="">Select Guardian</option>
                {guardians.map(g => (
                  <option key={g.userId} value={g.userId}>
                    {g.firstName} {g.lastName}
                  </option>
                ))}
              </Select>
            </Field>

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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
}