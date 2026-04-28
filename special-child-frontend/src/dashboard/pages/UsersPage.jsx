import React, { useState } from 'react';
import { useApi } from '../../../src/dashboard/useApi';
import { usersApi } from '../../services/apiService';
import { StatCard, DataTable, Badge, Modal, Field, Input, Select, SectionHeader, ActionButton, Alert } from '../../../src/dashboard/DashboardComponents';

const ROLES = ['Admin', 'Receptionist', 'Doctor', 'Patient', 'Guardian'];
const ROLE_MAP = { Admin: 1, Receptionist: 2, Doctor: 3, Patient: 4, Guardian: 5 };

export default function UsersPage() {
  const { data: users, loading, error, refetch } = useApi(usersApi.getAll);
  const [modal, setModal]   = useState(null); // null | 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);
  const [form, setForm]     = useState({ firstName: '', lastName: '', email: '', password: '', role: '', phoneNo: '' });
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function openCreate() { setForm({ firstName: '', lastName: '', email: '', password: '', role: '', phoneNo: '' }); setApiError(''); setModal('create'); }
  function openEdit(row) { setSelected(row); setForm({ firstName: row.firstName, lastName: row.lastName, phoneNo: row.phoneNo || '', role: row.role }); setApiError(''); setModal('edit'); }
  function openDelete(row) { setSelected(row); setModal('delete'); }
  function closeModal() { setModal(null); setSelected(null); setApiError(''); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true); setApiError('');
    try {
      await usersApi.create({ ...form, role: ROLE_MAP[form.role] });
      refetch(); closeModal();
    } catch (err) { setApiError(err.response?.data?.message || 'Failed to create user.'); }
    finally { setSaving(false); }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true); setApiError('');
    try {
      await usersApi.update(selected.userId, { firstName: form.firstName, lastName: form.lastName, phoneNo: form.phoneNo });
      refetch(); closeModal();
    } catch (err) { setApiError(err.response?.data?.message || 'Failed to update user.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    setSaving(true);
    try { await usersApi.delete(selected.userId); refetch(); closeModal(); }
    catch (err) { setApiError(err.response?.data?.message || 'Failed to delete user.'); }
    finally { setSaving(false); }
  }

  const active   = users.filter(u => u.isActive).length;
  const inactive = users.length - active;

  const columns = [
    { key: 'userId',    label: 'ID' },
    { key: 'firstName', label: 'Name', render: (_, r) => `${r.firstName} ${r.lastName}` },
    { key: 'email',     label: 'Email' },
    { key: 'role',      label: 'Role', render: v => <Badge label={v} color={v === 'Admin' ? 'blue' : v === 'Doctor' ? 'green' : 'gray'} /> },
    { key: 'phoneNo',   label: 'Phone' },
    { key: 'isActive',  label: 'Status', render: v => <Badge label={v ? 'Active' : 'Inactive'} color={v ? 'green' : 'red'} /> },
    { key: 'createdAt', label: 'Created', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Total Users"    value={users.length} sub="All registered" />
        <StatCard label="Active"         value={active}       sub="Currently active"   color="#1D9E75" />
        <StatCard label="Inactive"       value={inactive}     sub="Disabled accounts"  color="#E24B4A" />
        <StatCard label="Roles"          value={ROLES.length} sub="Available roles"    color="#EF9F27" />
      </div>

      <SectionHeader title="All Users" action={<ActionButton onClick={openCreate}>+ Add User</ActionButton>} />
      <DataTable columns={columns} rows={users} loading={loading} error={error} onEdit={openEdit} onDelete={openDelete} />

      {/* Create Modal */}
      {modal === 'create' && (
        <Modal title="Add New User" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="First Name"><Input value={form.firstName} onChange={set('firstName')} required /></Field>
              <Field label="Last Name"><Input value={form.lastName}  onChange={set('lastName')}  required /></Field>
            </div>
            <Field label="Email"><Input type="email" value={form.email} onChange={set('email')} required /></Field>
            <Field label="Password"><Input type="password" value={form.password} onChange={set('password')} required /></Field>
            <Field label="Phone"><Input type="tel" value={form.phoneNo} onChange={set('phoneNo')} /></Field>
            <Field label="Role">
              <Select value={form.role} onChange={set('role')} required>
                <option value="">Select role…</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Create User'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === 'edit' && (
        <Modal title="Edit User" onClose={closeModal}>
          {apiError && <Alert>{apiError}</Alert>}
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="First Name"><Input value={form.firstName} onChange={set('firstName')} /></Field>
              <Field label="Last Name"><Input value={form.lastName}  onChange={set('lastName')}  /></Field>
            </div>
            <Field label="Phone"><Input type="tel" value={form.phoneNo} onChange={set('phoneNo')} /></Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <ActionButton variant="outline" onClick={closeModal}>Cancel</ActionButton>
              <ActionButton>{saving ? 'Saving…' : 'Save Changes'}</ActionButton>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && (
        <Modal title="Delete User" onClose={closeModal}>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
            Are you sure you want to delete <strong>{selected?.firstName} {selected?.lastName}</strong>? This cannot be undone.
          </p>
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
