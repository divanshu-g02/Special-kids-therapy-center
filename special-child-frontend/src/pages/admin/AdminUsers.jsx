import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../../services/userService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, FieldRow } from '../../../components/ui/FormFields';

const ROLES    = ['Admin', 'Receptionist', 'Doctor', 'Patient', 'Guardian'];
const ROLE_MAP = { Admin: 1, Receptionist: 2, Doctor: 3, Patient: 4, Guardian: 5 };

export default function AdminUsers() {
  const { data: users, loading, error, refetch } = useApi(getAllUsers);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    role:      '',
    phoneNo:   '',
  });

  // Generic field updater
  // set('firstName') returns a function that updates form.firstName
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  function openCreate() {
    setForm({ firstName: '', lastName: '', email: '', password: '', role: '', phoneNo: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setForm({
      firstName: row.firstName,
      lastName:  row.lastName,
      phoneNo:   row.phoneNo || '',
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
      await createUser({ ...form, role: ROLE_MAP[form.role] });
      toast.success('User created successfully.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to create user.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(selected.userId, {
        firstName: form.firstName,
        lastName:  form.lastName,
        phoneNo:   form.phoneNo,
      });
      toast.success('User updated successfully.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteUser(selected.userId);
      toast.success('User deleted.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    } finally {
      setSaving(false);
    }
  }

  // Computed values for stat cards
  const active   = users.filter(u => u.isActive).length;
  const inactive = users.length - active;

  // Column definitions for DataTable
  // key      → field name from UserResponseDto
  // label    → column header text
  // render   → optional custom renderer
  const columns = [
    { key: 'userId',    label: 'ID' },
    {
      key: 'firstName',
      label: 'Name',
      // render receives (cellValue, fullRow)
      // we ignore cellValue and combine first+last from fullRow
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email',    label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: v => (
        <Badge
          label={v}
          color={v === 'Admin' ? 'blue' : v === 'Doctor' ? 'green' : 'gray'}
        />
      ),
    },
    { key: 'phoneNo', label: 'Phone' },
    {
      key: 'isActive',
      label: 'Status',
      render: v => (
        <Badge label={v ? 'Active' : 'Inactive'} color={v ? 'green' : 'red'} />
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: v => v ? new Date(v).toLocaleDateString() : '—',
    },
  ];

  return (
    <div>
      {/* ── Stat cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <StatCard label="Total Users" value={users.length} sub="All registered" />
        <StatCard label="Active"      value={active}       sub="Currently active"  color="#1D9E75" />
        <StatCard label="Inactive"    value={inactive}     sub="Disabled accounts" color="#E24B4A" />
        <StatCard label="Roles"       value={ROLES.length} sub="Available roles"   color="#EF9F27" />
      </div>

      {/* ── Table header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
          All Users
        </h2>
        <Button onClick={openCreate}>+ Add User</Button>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={columns}
        rows={users}
        loading={loading}
        error={error}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* ── Create modal ── */}
      {modal === 'create' && (
        <Modal title="Add New User" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <FieldRow>
              <Field label="First Name" required>
                <Input value={form.firstName} onChange={set('firstName')} required />
              </Field>
              <Field label="Last Name" required>
                <Input value={form.lastName} onChange={set('lastName')} required />
              </Field>
            </FieldRow>
            <Field label="Email" required>
              <Input type="email" value={form.email} onChange={set('email')} required />
            </Field>
            <Field label="Password" required>
              <Input type="password" value={form.password} onChange={set('password')} required />
            </Field>
            <Field label="Phone">
              <Input type="tel" value={form.phoneNo} onChange={set('phoneNo')} />
            </Field>
            <Field label="Role" required>
              <Select value={form.role} onChange={set('role')} required>
                <option value="">Select role…</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit modal ── */}
      {modal === 'edit' && (
        <Modal title="Edit User" onClose={closeModal}>
          <form onSubmit={handleUpdate}>
            <FieldRow>
              <Field label="First Name">
                <Input value={form.firstName} onChange={set('firstName')} />
              </Field>
              <Field label="Last Name">
                <Input value={form.lastName} onChange={set('lastName')} />
              </Field>
            </FieldRow>
            <Field label="Phone">
              <Input type="tel" value={form.phoneNo} onChange={set('phoneNo')} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete modal ── */}
      {modal === 'delete' && (
        <Modal title="Delete User" onClose={closeModal} width="400px">
          <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6, marginBottom: '20px' }}>
            Are you sure you want to delete{' '}
            <strong>{selected?.firstName} {selected?.lastName}</strong>?
            This cannot be undone.
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