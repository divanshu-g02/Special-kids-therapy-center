import api from './api';

export const appointmentsApi = {
  getAll: async () => {
    const res = await api.get('/appointment');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/appointment/${id}`);
    return res.data;
  },

  create: async (dto) => {
    const res = await api.post('/appointment', dto);
    return res.data;
  },

  update: async (id, dto) => {
    const res = await api.put(`/appointment/${id}`, dto);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/appointment/${id}`);
    return res.data;
  }
};