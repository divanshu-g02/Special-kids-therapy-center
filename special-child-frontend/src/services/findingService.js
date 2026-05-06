import api from './api';

export async function getAllFindings() {
  const res = await api.get('/doctorfinding');
  return res.data;
}
export async function getFindingById(id) {
  const res = await api.get(`/doctorfinding/${id}`);
  return res.data;
}
export async function createFinding(dto) {
  const res = await api.post('/doctorfinding', dto);
  return res.data;
}
export async function updateFinding(id, dto) {
  const res = await api.put(`/doctorfinding/${id}`, dto);
  return res.data;
}
export async function deleteFinding(id) {
  const res = await api.delete(`/doctorfinding/${id}`);
  return res.data;
}