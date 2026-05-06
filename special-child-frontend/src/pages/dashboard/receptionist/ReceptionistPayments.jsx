import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllPayments, createPayment, updatePayment } from '../../../services/paymentService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, FieldRow } from '../../../components/ui/FormFields';

const PAY_METHODS  = ['Cash', 'Card', 'BankTransfer', 'Online'];
const PAY_STATUSES = ['Pending', 'Completed', 'Failed', 'Refunded'];

function payColor(s) {
  return { Completed:'green', Pending:'orange', Failed:'red', Refunded:'gray' }[s] || 'gray';
}

export default function ReceptionistPayments() {
  const { data: payments, loading, error, refetch } = useApi(getAllPayments);
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({ appointmentId: '', amount: '', paymentMethod: 'Cash', transactionId: '' });
  const [editForm, setEditForm] = useState({ paymentMethod: '', status: '', transactionId: '' });

  const set  = key => e => setForm(f     => ({ ...f, [key]: e.target.value }));
  const setE = key => e => setEditForm(f => ({ ...f, [key]: e.target.value }));

  function openCreate() {
    setForm({ appointmentId: '', amount: '', paymentMethod: 'Cash', transactionId: '' });
    setModal('create');
  }
  function openEdit(row) {
    setSelected(row);
    setEditForm({ paymentMethod: row.paymentMethod || '', status: row.status, transactionId: row.transactionId || '' });
    setModal('edit');
  }
  function closeModal() { setModal(null); setSelected(null); }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createPayment({
        appointmentId: parseInt(form.appointmentId),
        amount:        parseFloat(form.amount),
        paymentMethod: form.paymentMethod,
        transactionId: form.transactionId || null,
      });
      toast.success('Payment recorded.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to record payment.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePayment(selected.paymentId, editForm);
      toast.success('Payment updated.');
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err.message || 'Failed to update payment.');
    } finally {
      setSaving(false);
    }
  }

  const revenue = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);

  const columns = [
    { key: 'paymentId',     label: '#' },
    { key: 'patientName',   label: 'Patient' },
    { key: 'amount',        label: 'Amount',  render: v => `Rs. ${v?.toLocaleString()}` },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'status',        label: 'Status',  render: v => <Badge label={v} color={payColor(v)} /> },
    { key: 'paidAt',        label: 'Paid At', render: v => v ? new Date(v).toLocaleDateString() : '—' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total"   value={payments.length} />
        <StatCard label="Revenue" value={`Rs. ${revenue.toLocaleString()}`}                          color="#1D9E75" />
        <StatCard label="Pending" value={payments.filter(p => p.status === 'Pending').length}        color="#EF9F27" />
        <StatCard label="Failed"  value={payments.filter(p => p.status === 'Failed').length}         color="#E24B4A" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>Payments</h2>
        <Button onClick={openCreate}>+ Record Payment</Button>
      </div>

      <DataTable columns={columns} rows={payments} loading={loading} error={error} onEdit={openEdit} />

      {modal === 'create' && (
        <Modal title="Record Payment" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <Field label="Appointment ID" required>
              <Input type="number" value={form.appointmentId} onChange={set('appointmentId')} required />
            </Field>
            <FieldRow>
              <Field label="Amount (Rs.)" required>
                <Input type="number" step="0.01" value={form.amount} onChange={set('amount')} required />
              </Field>
              <Field label="Method">
                <Select value={form.paymentMethod} onChange={set('paymentMethod')}>
                  {PAY_METHODS.map(m => <option key={m}>{m}</option>)}
                </Select>
              </Field>
            </FieldRow>
            <Field label="Transaction ID">
              <Input value={form.transactionId} onChange={set('transactionId')} placeholder="Optional" />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Record'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'edit' && (
        <Modal title="Update Payment" onClose={closeModal} width="400px">
          <form onSubmit={handleUpdate}>
            <FieldRow>
              <Field label="Method">
                <Select value={editForm.paymentMethod} onChange={setE('paymentMethod')}>
                  {PAY_METHODS.map(m => <option key={m}>{m}</option>)}
                </Select>
              </Field>
              <Field label="Status">
                <Select value={editForm.status} onChange={setE('status')}>
                  {PAY_STATUSES.map(s => <option key={s}>{s}</option>)}
                </Select>
              </Field>
            </FieldRow>
            <Field label="Transaction ID">
              <Input value={editForm.transactionId} onChange={setE('transactionId')} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}