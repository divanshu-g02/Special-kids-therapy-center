import api from './authService';

// ── Users
export const usersApi = {
  getAll:   ()        => api.get('/user').then(r => r.data),
  getById:  (id)      => api.get(`/user/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/user', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/user/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/user/${id}`).then(r => r.data),
};

// ── Doctors
export const doctorsApi = {
  getAll:   ()        => api.get('/doctor').then(r => r.data),
  getById:  (id)      => api.get(`/doctor/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/doctor', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/doctor/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/doctor/${id}`).then(r => r.data),
};

// ── Patients
export const patientsApi = {
  getAll:   ()        => api.get('/patient').then(r => r.data),
  getById:  (id)      => api.get(`/patient/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/patient', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/patient/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/patient/${id}`).then(r => r.data),
};

// ── Appointments
export const appointmentsApi = {
  getAll:   ()        => api.get('/appointment').then(r => r.data),
  getById:  (id)      => api.get(`/appointment/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/appointment', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/appointment/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/appointment/${id}`).then(r => r.data),
};

// ── Slots
export const slotsApi = {
  getAll:   ()        => api.get('/slot').then(r => r.data),
  getById:  (id)      => api.get(`/slot/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/slot', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/slot/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/slot/${id}`).then(r => r.data),
};

// ── Payments
export const paymentsApi = {
  getAll:   ()        => api.get('/payment').then(r => r.data),
  getById:  (id)      => api.get(`/payment/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/payment', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/payment/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/payment/${id}`).then(r => r.data),
};

// ── Doctor Findings
export const findingsApi = {
  getAll:   ()        => api.get('/doctorfinding').then(r => r.data),
  getById:  (id)      => api.get(`/doctorfinding/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/doctorfinding', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/doctorfinding/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/doctorfinding/${id}`).then(r => r.data),
};

// ── Therapies
export const therapiesApi = {
  getAll:   ()        => api.get('/therapy').then(r => r.data),
  getById:  (id)      => api.get(`/therapy/${id}`).then(r => r.data),
  create:   (dto)     => api.post('/therapy', dto).then(r => r.data),
  update:   (id, dto) => api.put(`/therapy/${id}`, dto).then(r => r.data),
  delete:   (id)      => api.delete(`/therapy/${id}`).then(r => r.data),
};
