import api from './api';

export async function getAllTherapies() {
  const res = await api.get('/therapy');
  return res.data;
}
export async function getTherapyById(id) {
  const res = await api.get(`/therapy/${id}`);
  return res.data;
}
export async function createTherapy(dto) {
  const res = await api.post('/therapy', dto);
  return res.data;
}
export async function updateTherapy(id, dto) {
  const res = await api.put(`/therapy/${id}`, dto);
  return res.data;
}
export async function deleteTherapy(id) {
  const res = await api.delete(`/therapy/${id}`);
  return res.data;
}