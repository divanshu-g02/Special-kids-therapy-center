import api from './api';

export async function getAllDoctors() {
  const res = await api.get('/doctor');
  return res.data;
}
export async function getDoctorById(id) {
  const res = await api.get(`/doctor/${id}`);
  return res.data;
}
export async function createDoctor(dto) {
  const res = await api.post('/doctor', dto);
  return res.data;
}
export async function updateDoctor(id, dto) {
  const res = await api.put(`/doctor/${id}`, dto);
  return res.data;
}
export async function deleteDoctor(id) {
  const res = await api.delete(`/doctor/${id}`);
  return res.data;
}