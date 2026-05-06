import { useState } from 'react';
import { useApi } from '../../../hooks/useApi';
import { getAllPayments, updatePayment } from '../../../services/paymentService';
import toast from 'react-hot-toast';
import StatCard from '../../../components/ui/StatCard';
import DataTable from '../../../components/ui/DataTable';
import Badge from '../../../components/ui/Badges';

function payColor(s) {
  return { Completed:'green', Pending:'orange', Failed:'red', Refunded:'gray' }[s] || 'gray';
}

export default function PatientPayments() {
  const { data: payments, loading, error, refetch } = useApi(getAllPayments);
  const [razorLoading, setRazorLoading] = useState(false);

  // Razorpay online payment flow
  function initiateRazorpay(payment) {
    setRazorLoading(true);
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
          // Called by Razorpay after successful payment
          // response.razorpay_payment_id is the transaction reference
          try {
            await updatePayment(payment.paymentId, {
              paymentMethod: 'Online',
              status:        'Completed',
              transactionId: response.razorpay_payment_id,
            });
            toast.success('Payment successful!');
            refetch();
          } catch {
            toast.error('Payment done but failed to update. Contact reception.');
          }
        },
        prefill: { name: payment.patientName },
        theme:   { color: '#1A5F7A' },
        modal: {
          ondismiss: () => setRazorLoading(false),
        },
      };
      new window.Razorpay(options).open();
      setRazorLoading(false);
    };
    script.onerror = () => {
      toast.error('Failed to load payment gateway.');
      setRazorLoading(false);
    };
    document.body.appendChild(script);
  }

  const revenue = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);

  const columns = [
    { key: 'paymentId',     label: '#' },
    { key: 'amount',        label: 'Amount',  render: v => `Rs. ${v?.toLocaleString()}` },
    { key: 'paymentMethod', label: 'Method' },
    { key: 'status',        label: 'Status',  render: v => <Badge label={v} color={payColor(v)} /> },
    { key: 'paidAt',        label: 'Paid At', render: v => v ? new Date(v).toLocaleDateString() : '—' },
    {
      key: '_pay',
      label: 'Pay Online',
      render: (_, row) => row.status !== 'Completed'
        ? (
          <button
            onClick={() => initiateRazorpay(row)}
            disabled={razorLoading}
            style={{ background: '#1A5F7A', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Pay Now
          </button>
        )
        : <Badge label="Paid" color="green" />,
    },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard label="Total"    value={payments.length} />
        <StatCard label="Paid"     value={`Rs. ${revenue.toLocaleString()}`}                          color="#1D9E75" />
        <StatCard label="Pending"  value={payments.filter(p => p.status === 'Pending').length}        color="#EF9F27" />
      </div>
      <h2 style={{ fontSize: '15px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>My Payments</h2>
      <DataTable columns={columns} rows={payments} loading={loading} error={error} />
    </div>
  );
}