// Connects to: PaymentController.cs
// Route: /api/payment
// Access:
//   GET    → Admin, Receptionist
//   GET by id → Admin, Receptionist, Guardian
//   POST   → Admin, Receptionist
//   PUT    → Admin, Receptionist
//   DELETE → Admin only

import api from './api';

// GET /api/payment
// Returns: List<PaymentResponseDto>
// PaymentResponseDto: { paymentId, appointmentId, patientName, amount,
//   paymentMethod, transactionId, status, paidAt, createdAt }
export async function getAllPayments() {
  const res = await api.get('/payment');
  return res.data;
}

// GET /api/payment/{id}
// Returns: PaymentResponseDto
export async function getPaymentById(id) {
  const res = await api.get(`/payment/${id}`);
  return res.data;
}

// POST /api/payment
// Sends: PaymentCreateDto { appointmentId, amount, paymentMethod?, transactionId? }
// paymentMethod: "Cash" | "Card" | "BankTransfer" | "Online"
// amount: decimal e.g. 1500.00
// Returns: PaymentResponseDto
export async function createPayment(dto) {
  const res = await api.post('/payment', dto);
  return res.data;
}

// PUT /api/payment/{id}
// Sends: PaymentUpdateDto { paymentMethod, status?, transactionId?, paidAt? }
// status: "Pending" | "Completed" | "Failed" | "Refunded"
// Called after Razorpay confirms payment to mark as Completed
// transactionId → Razorpay payment ID e.g. "pay_ABC123"
// Returns: PaymentResponseDto
export async function updatePayment(id, dto) {
  const res = await api.put(`/payment/${id}`, dto);
  return res.data;
}

// DELETE /api/payment/{id}
// Returns: bool
export async function deletePayment(id) {
  const res = await api.delete(`/payment/${id}`);
  return res.data;
}