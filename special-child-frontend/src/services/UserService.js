import api from './api';

const ROLE_MAP = { Admin: 1, Receptionist: 2, Doctor: 3, Patient: 4, Guardian: 5 };

export async function getAllUsers() {
  const res = await api.get('/user');
  return res.data;
}

export async function getUserById(id) {
  const res = await api.get(`/user/${id}`);
  return res.data;
}

export async function createUser(dto) {
  const res = await api.post('/user', {
    ...dto,
    role: ROLE_MAP[dto.role],
  });
  return res.data;
}

export async function updateUser(id, dto) {
  const res = await api.put(`/user/${id}`, dto);
  return res.data;
}

export async function deleteUser(id) {
  const res = await api.delete(`/user/${id}`);
  return res.data;
}