// Connects to: TherapyController.cs (assumed from your DTOs)
// Route: /api/therapy
// Access: All roles can read, Admin manages

import api from './api';

// GET /api/therapy
// Returns: List<TherapyResponseDto>
// TherapyResponseDto: { therapyId, name, description, durationMinutes, cost }
export async function getAllTherapies() {
  const res = await api.get('/therapy');
  return res.data;
}

// GET /api/therapy/{id}
// Returns: TherapyResponseDto
export async function getTherapyById(id) {
  const res = await api.get(`/therapy/${id}`);
  return res.data;
}

// POST /api/therapy
// Sends: TherapyCreateDto { name, description?, durationMinutes, cost }
// durationMinutes → integer e.g. 45
// cost → decimal e.g. 2500.00
// Returns: TherapyResponseDto
export async function createTherapy(dto) {
  const res = await api.post('/therapy', dto);
  return res.data;
}

// PUT /api/therapy/{id}
// Sends: TherapyUpdateDto { name?, description?, durationMinutes?, cost? }
// Returns: TherapyResponseDto
export async function updateTherapy(id, dto) {
  const res = await api.put(`/therapy/${id}`, dto);
  return res.data;
}

// DELETE /api/therapy/{id}
// Returns: bool
export async function deleteTherapy(id) {
  const res = await api.delete(`/therapy/${id}`);
  return res.data;
}