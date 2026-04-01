using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Slot;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class SlotService : ISlotService
    {
        private readonly ISlotRepository _slotRepository;

        public SlotService(ISlotRepository slotRepository)
        {
            _slotRepository = slotRepository;
        }

        public async Task<List<SlotResponseDto>> GetAllAsync()
        {
            return await _slotRepository.GetAllAsync()
                .Include(s => s.Doctor).ThenInclude(d => d.User)
                .Select(s => new SlotResponseDto
                {
                    SlotId = s.SlotId,
                    DoctorId = s.DoctorId,
                    DoctorName = $"{s.Doctor.User.FirstName} {s.Doctor.User.LastName}",
                    Date = s.Date,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    IsBooked = s.IsBooked
                }).ToListAsync();
        }

        public async Task<SlotResponseDto?> GetByIdAsync(int id)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null)
                throw new KeyNotFoundException($"Slot with ID {id} not found");

            return new SlotResponseDto
            {
                SlotId = slot.SlotId,
                DoctorId = slot.DoctorId,
                Date = slot.Date,
                StartTime = slot.StartTime,
                EndTime = slot.EndTime,
                IsBooked = slot.IsBooked
            };
        }

        public async Task<SlotResponseDto> CreateAsync(SlotCreateDto dto)
        {
            var slot = new Slot
            {
                DoctorId = dto.DoctorId,
                Date = dto.Date,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                IsBooked = false
            };

            var created = await _slotRepository.CreateAsync(slot);

            return new SlotResponseDto
            {
                SlotId = created.SlotId,
                DoctorId = created.DoctorId,
                Date = created.Date,
                StartTime = created.StartTime,
                EndTime = created.EndTime,
                IsBooked = created.IsBooked
            };
        }

        public async Task<SlotResponseDto> UpdateAsync(int id, SlotUpdateDto dto)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null)
                throw new KeyNotFoundException($"Slot with ID {id} not found");

            if (dto.Date != null) slot.Date = dto.Date.Value;
            if (dto.StartTime != null) slot.StartTime = dto.StartTime.Value;
            if (dto.EndTime != null) slot.EndTime = dto.EndTime.Value;
            if (dto.IsBooked != null) slot.IsBooked = dto.IsBooked.Value;

            var updated = await _slotRepository.UpdateAsync(slot);

            return new SlotResponseDto
            {
                SlotId = updated.SlotId,
                DoctorId = updated.DoctorId,
                Date = updated.Date,
                StartTime = updated.StartTime,
                EndTime = updated.EndTime,
                IsBooked = updated.IsBooked
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var slot = await _slotRepository.GetByIdAsync(id);
            if (slot == null)
                throw new KeyNotFoundException($"Slot with ID {id} not found");

            return await _slotRepository.DeleteAsync(id);
        }
    }
}
