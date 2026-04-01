using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Therapy;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class TherapyService : ITherapyService
    {
        private readonly ITherapyRepository _therapyRepository;

        public TherapyService(ITherapyRepository therapyRepository)
        {
            _therapyRepository = therapyRepository;
        }

        public async Task<List<TherapyResponseDto>> GetAllAsync()
        {
            return await _therapyRepository.GetAllAsync()
                .Select(t => new TherapyResponseDto
                {
                    TherapyId = t.TherapyId,
                    Name = t.Name,
                    Description = t.Description,
                    DurationMinutes = t.DurationMinutes,
                    Cost = t.Cost
                }).ToListAsync();
        }

        public async Task<TherapyResponseDto?> GetByIdAsync(int id)
        {
            var therapy = await _therapyRepository.GetByIdAsync(id);
            if (therapy == null)
                throw new KeyNotFoundException($"Therapy with ID {id} not found");

            return new TherapyResponseDto
            {
                TherapyId = therapy.TherapyId,
                Name = therapy.Name,
                Description = therapy.Description,
                DurationMinutes = therapy.DurationMinutes,
                Cost = therapy.Cost
            };
        }

        public async Task<TherapyResponseDto> CreateAsync(TherapyCreateDto dto)
        {
            var therapy = new Therapy
            {
                Name = dto.Name,
                Description = dto.Description,
                DurationMinutes = dto.DurationMinutes,
                Cost = dto.Cost
            };

            var created = await _therapyRepository.CreateAsync(therapy);

            return new TherapyResponseDto
            {
                TherapyId = created.TherapyId,
                Name = created.Name,
                Description = created.Description,
                DurationMinutes = created.DurationMinutes,
                Cost = created.Cost
            };
        }

        public async Task<TherapyResponseDto> UpdateAsync(int id, TherapyUpdateDto dto)
        {
            var therapy = await _therapyRepository.GetByIdAsync(id);
            if (therapy == null)
                throw new KeyNotFoundException($"Therapy with ID {id} not found");

            if (dto.Name != null) therapy.Name = dto.Name;
            if (dto.Description != null) therapy.Description = dto.Description;
            if (dto.DurationMinutes != null) therapy.DurationMinutes = dto.DurationMinutes.Value;
            if (dto.Cost != null) therapy.Cost = dto.Cost.Value;

            var updated = await _therapyRepository.UpdateAsync(therapy);

            return new TherapyResponseDto
            {
                TherapyId = updated.TherapyId,
                Name = updated.Name,
                Description = updated.Description,
                DurationMinutes = updated.DurationMinutes,
                Cost = updated.Cost
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var therapy = await _therapyRepository.GetByIdAsync(id);
            if (therapy == null)
                throw new KeyNotFoundException($"Therapy with ID {id} not found");

            return await _therapyRepository.DeleteAsync(id);
        }
    }
}