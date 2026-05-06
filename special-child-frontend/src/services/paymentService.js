import api from './api';

export async function getAllPayments() {
  const res = await api.get('/payment');
  return res.data;
}
export async function getPaymentById(id) {
  const res = await api.get(`/payment/${id}`);
  return res.data;
}
export async function createPayment(dto) {
  const res = await api.post('/payment', dto);
  return res.data;
}
export async function updatePayment(id, dto) {
  const res = await api.put(`/payment/${id}`, dto);
  return res.data;
}
export async function deletePayment(id) {
  const res = await api.delete(`/payment/${id}`);
  return res.data;
}