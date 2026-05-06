import api from './api';

export async function getAllPatients() {
  const res = await api.get('/patient');
  return res.data;
}
export async function getPatientById(id) {
  const res = await api.get(`/patient/${id}`);
  return res.data;
}
export async function getPatientByUserId(userId) {
  const res = await api.get(`/patient/by-user/${userId}`);
  return res.data;
}
export async function createPatient(dto) {
  const res = await api.post('/patient', dto);
  return res.data;
}
export async function updatePatient(id, dto) {
  const res = await api.put(`/patient/${id}`, dto);
  return res.data;
}
export async function deletePatient(id) {
  const res = await api.delete(`/patient/${id}`);
  return res.data;
}