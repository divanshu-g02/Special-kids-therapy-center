import api from './api';

// GET /api/slot
// Returns: List<SlotResponseDto>
// SlotResponseDto: { slotId, doctorId, doctorName, date, startTime, endTime, isBooked }
export async function getAllSlots() {
  const res = await api.get('/slot');
  return res.data;
}

// GET /api/slot/{id}
// Returns: SlotResponseDto
export async function getSlotById(id) {
  const res = await api.get(`/slot/${id}`);
  return res.data;
}

// POST /api/slot
// Sends: SlotCreateDto { doctorId, date, startTime, endTime }
// date → "2025-06-15"
// startTime/endTime → "09:00:00"
// Returns: SlotResponseDto
export async function createSlot(dto) {
  const res = await api.post('/slot', dto);
  return res.data;
}

// PUT /api/slot/{id}
// Sends: SlotUpdateDto { date?, startTime?, endTime?, isBooked? }
// Set isBooked: true when appointment is booked for this slot
// Returns: SlotResponseDto
export async function updateSlot(id, dto) {
  const res = await api.put(`/slot/${id}`, dto);
  return res.data;
}

// DELETE /api/slot/{id}
// Returns: bool
export async function deleteSlot(id) {
  const res = await api.delete(`/slot/${id}`);
  return res.data;
}