import api from './api';

export async function getAllSlots() {
  const res = await api.get('/slot');
  return res.data;
}
export async function getSlotById(id) {
  const res = await api.get(`/slot/${id}`);
  return res.data;
}
export async function createSlot(dto) {
  const res = await api.post('/slot', dto);
  return res.data;
}
export async function updateSlot(id, dto) {
  const res = await api.put(`/slot/${id}`, dto);
  return res.data;
}
export async function deleteSlot(id) {
  const res = await api.delete(`/slot/${id}`);
  return res.data;
}