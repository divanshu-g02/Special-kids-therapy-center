using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Doctor;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorService(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        public async Task<List<DoctorResponseDto>> GetAllAsync()
        {
            return await _doctorRepository.GetAllAsync()
                .Include(d => d.User)
                .Select(d => new DoctorResponseDto
                {
                    DoctorId = d.DoctorId,
                    UserId = d.UserId,
                    FullName = $"{d.User.FirstName} {d.User.LastName}",
                    Email = d.User.Email,
                    Specialization = d.Specialization,
                    Bio = d.Bio,
                    AvailableDays = d.AvailableDays,
                    StartTime = d.StartTime,
                    EndTime = d.EndTime
                }).ToListAsync();
        }

        public async Task<DoctorResponseDto?> GetByIdAsync(int id)
        {
            var doctor = await _doctorRepository.GetByIdAsync(id);
            if (doctor == null)
                throw new KeyNotFoundException($"Doctor with ID {id} not found");

            return new DoctorResponseDto
            {
                DoctorId = doctor.DoctorId,
                UserId = doctor.UserId,
                Specialization = doctor.Specialization,
                Bio = doctor.Bio,
                AvailableDays = doctor.AvailableDays,
                StartTime = doctor.StartTime,
                EndTime = doctor.EndTime
            };
        }

        public async Task<DoctorResponseDto> CreateAsync(DoctorCreateDto dto)
        {
            var doctor = new Doctor
            {
                UserId = dto.UserId,
                Specialization = dto.Specialization,
                Bio = dto.Bio,
                AvailableDays = dto.AvailableDays,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            var created = await _doctorRepository.CreateAsync(doctor);

            return new DoctorResponseDto
            {
                DoctorId = created.DoctorId,
                UserId = created.UserId,
                Specialization = created.Specialization,
                Bio = created.Bio,
                AvailableDays = created.AvailableDays,
                StartTime = created.StartTime,
                EndTime = created.EndTime
            };
        }

        public async Task<DoctorResponseDto> UpdateAsync(int id, DoctorUpdateDto dto)
        {
            var doctor = await _doctorRepository.GetByIdAsync(id);
            if (doctor == null)
                throw new KeyNotFoundException($"Doctor with ID {id} not found");

            if (dto.Specialization != null) doctor.Specialization = dto.Specialization;
            if (dto.Bio != null) doctor.Bio = dto.Bio;
            if (dto.AvailableDays != null) doctor.AvailableDays = dto.AvailableDays;
            if (dto.StartTime != null) doctor.StartTime = dto.StartTime;
            if (dto.EndTime != null) doctor.EndTime = dto.EndTime;

            var updated = await _doctorRepository.UpdateAsync(doctor);

            return new DoctorResponseDto
            {
                DoctorId = updated.DoctorId,
                UserId = updated.UserId,
                Specialization = updated.Specialization,
                Bio = updated.Bio,
                AvailableDays = updated.AvailableDays,
                StartTime = updated.StartTime,
                EndTime = updated.EndTime
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var doctor = await _doctorRepository.GetByIdAsync(id);
            if (doctor == null)
                throw new KeyNotFoundException($"Doctor with ID {id} not found");

            return await _doctorRepository.DeleteAsync(id);
        }
    }
}