import { useState } from 'react';
import toast from 'react-hot-toast';
import { useApi } from '../../../hooks/useApi';
import { getAllPayments, createPayment, updatePayment } from '../../../services/paymentService';
import { getAllAppointments } from '../../../services/appointmentService';
import { getSession } from '../../../services/authService';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge, { paymentStatusColor } from '../../../components/ui/Badges';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Buttons';
import { Field, Input, Select, FieldRow } from '../../../components/ui/FormFields';

const PAY_METHODS  = ['Cash', 'Card', 'BankTransfer', 'Online'];
const PAY_STATUSES = ['Pending', 'Completed', 'Failed', 'Refunded'];

export default function AdminPayments() {
  const { role } = getSession();
  const { data: payments, loading, error, refetch } = useApi(getAllPayments);
  const { data: appointments = [] } = useApi(getAllAppointments);

  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);

  const [form,     setForm]     = useState({ appointmentId: '', amount: '', paymentMethod: 'Cash', transactionId: '' });
  const [editForm, setEditForm] = useState({ paymentMethod: '', status: '', transactionId: '' });

  const set  = key => e => setForm(f     => ({ ...f, [key]: e.target.value }));
  const setE = key => e => setEditForm(f => ({ ...f, [key]: e.target.value }));

  const canWrite = ['Admin', 'Receptionist'].includes(role);

  function openCreate() {
    setForm({ appointmentId: '', amount: '', paymentMethod: 'Cash', transactionId: '' });
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setEditForm({ paymentMethod: row.paymentMethod || '', status: row.status, transactionId: row.transactionId || '' });
    setModal('edit');
  }

  function openInvoice(row) { setSelected(row); setModal('invoice'); }
  function closeModal()     { setModal(null); setSelected(null); }

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

  // Razorpay online payment
  // Loads the Razorpay script dynamically and opens the payment modal
  function initiateRazorpay(payment) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key:         'YOUR_RAZORPAY_KEY_ID', // replace with your key
        amount:      payment.amount * 100,   // Razorpay uses paise
        currency:    'INR',
        name:        'Special Kids Therapy Center',
        description: `Payment #${payment.paymentId}`,
        handler: async function (response) {
          // Razorpay calls this after successful payment
          // response.razorpay_payment_id is the transaction ID
          try {
            await updatePayment(payment.paymentId, {
              paymentMethod: 'Online',
              status:        'Completed',
              transactionId: response.razorpay_payment_id,
            });
            toast.success('Payment successful!');
            refetch();
          } catch {
            toast.error('Payment done but failed to update. Contact admin.');
          }
        },
        prefill: { name: payment.patientName },
        theme:   { color: '#1A5F7A' },
      };
      new window.Razorpay(options).open();
    };
    script.onerror = () => toast.error('Failed to load Razorpay.');
    document.body.appendChild(script);
  }

  const revenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const columns = [
    { key: 'paymentId',     label: '#' },
    { key: 'patientName',   label: 'Patient' },
    { key: 'amount',        label: 'Amount',  render: v => `Rs. ${v?.toLocaleString()}` },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'status',        label: 'Status',  render: v => <Badge label={v} color={paymentStatusColor(v)} /> },
    { key: 'paidAt',        label: 'Paid At', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    {
      key: '_pay',
      label: 'Online',
      render: (_, row) => row.status !== 'Completed'
        ? <button onClick={() => initiateRazorpay(row)}
            style={{ background: '#1A5F7A', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer' }}>
            Pay via Razorpay
          </button>
        : <Badge label="Paid" color="green" />,
    },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard label="Total"    value={payments.length} />
        <StatCard label="Revenue"  value={`Rs. ${revenue.toLocaleString()}`} color="#1D9E75" />
        <StatCard label="Pending"  value={payments.filter(p => p.status === 'Pending').length}  color="#EF9F27" />
        <StatCard label="Failed"   value={payments.filter(p => p.status === 'Failed').length}   color="#E24B4A" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>All Payments</h2>
        {canWrite && <Button onClick={openCreate}>+ Add Payment</Button>}
      </div>

      <DataTable columns={columns} rows={payments} loading={loading} error={error}
        onEdit={canWrite ? openEdit : null}
      />

      {modal === 'create' && (
        <Modal title="Record Payment" onClose={closeModal}>
          <form onSubmit={handleCreate}>
            <Field label="Appointment" required>
              <Select value={form.appointmentId} onChange={set('appointmentId')} required>
                <option value="">Select appointment...</option>
                {appointments.map(a => (
                  <option key={a.appointmentId} value={a.appointmentId}>
                    #{a.appointmentId} — {a.patientName} ({a.appointmentDate})
                  </option>
                ))}
              </Select>
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
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Record Payment'}</Button>
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