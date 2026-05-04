// Connects to: DoctorFindingController.cs
// Route: /api/doctorfinding
// Access:
//   GET    → Admin, Doctor
//   GET by id → Admin, Doctor, Guardian
//   POST   → Doctor only
//   PUT    → Doctor only
//   DELETE → Admin only

import api from './api';

// GET /api/doctorfinding
// Returns: List<DoctorFindingResponseDto>
// DoctorFindingResponseDto: { findingId, appointmentId, patientName, doctorName,
//   observations, recommendations, nextSessionDate, createdAt }
export async function getAllFindings() {
  const res = await api.get('/doctorfinding');
  return res.data;
}

// GET /api/doctorfinding/{id}
// Returns: DoctorFindingResponseDto
export async function getFindingById(id) {
  const res = await api.get(`/doctorfinding/${id}`);
  return res.data;
}

// POST /api/doctorfinding
// Sends: DoctorFindingCreateDto { appointmentId, observations?, recommendations?, nextSessionDate? }
// nextSessionDate → "2025-07-01" (DateOnly in .NET)
// Returns: DoctorFindingResponseDto
export async function createFinding(dto) {
  const res = await api.post('/doctorfinding', dto);
  return res.data;
}

// PUT /api/doctorfinding/{id}
// Sends: DoctorFindingUpdateDto { observations?, recommendations?, nextSessionDate? }
// Returns: DoctorFindingResponseDto
export async function updateFinding(id, dto) {
  const res = await api.put(`/doctorfinding/${id}`, dto);
  return res.data;
}

// DELETE /api/doctorfinding/{id}
// Returns: bool
export async function deleteFinding(id) {
  const res = await api.delete(`/doctorfinding/${id}`);
  return res.data;
}