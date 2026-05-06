import api from './api';

export async function getAllAppointments() {
  const res = await api.get('/appointment');
  return res.data;
}
export async function getAppointmentById(id) {
  const res = await api.get(`/appointment/${id}`);
  return res.data;
}
export async function createAppointment(dto) {
  const res = await api.post('/appointment', dto);
  return res.data;
}
export async function updateAppointment(id, dto) {
  const res = await api.put(`/appointment/${id}`, dto);
  return res.data;
}
export async function deleteAppointment(id) {
  const res = await api.delete(`/appointment/${id}`);
  return res.data;
}