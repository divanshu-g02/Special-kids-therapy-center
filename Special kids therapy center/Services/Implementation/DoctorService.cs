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
            var doctors = await _doctorRepository.GetAllAsync()
                .Include(d => d.User)
                .ToListAsync();

            return doctors.Select(d => new DoctorResponseDto
            {
                DoctorId = d.DoctorId,
                UserId = d.UserId,
                FullName = d.User != null
                    ? $"{d.User.FirstName} {d.User.LastName}"
                    : string.Empty,
                Email = d.User?.Email ?? string.Empty,
                Specialization = d.Specialization,
                Bio = d.Bio,
                AvailableDays = d.AvailableDays,
                StartTime = d.StartTime,
                EndTime = d.EndTime
            }).ToList();
        }

        public async Task<DoctorResponseDto?> GetByIdAsync(int id)
        {
            var doctor = await _doctorRepository.GetByIdQueryable(id)
                .Include(d => d.User)
                .FirstOrDefaultAsync();

            if (doctor == null)
                return null;

            return new DoctorResponseDto
            {
                DoctorId = doctor.DoctorId,
                UserId = doctor.UserId,
                FullName = doctor.User != null
                    ? $"{doctor.User.FirstName} {doctor.User.LastName}"
                    : string.Empty,
                Email = doctor.User?.Email ?? string.Empty,
                Specialization = doctor.Specialization,
                Bio = doctor.Bio,
                AvailableDays = doctor.AvailableDays,
                StartTime = doctor.StartTime,
                EndTime = doctor.EndTime
            };
        }

        public async Task<DoctorResponseDto?> GetByUserIdAsync(int userId)
        {
            var doctor = await _doctorRepository.GetAllAsync()
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                return null;

            return new DoctorResponseDto
            {
                DoctorId = doctor.DoctorId,
                UserId = doctor.UserId,
                FullName = doctor.User != null
                    ? $"{doctor.User.FirstName} {doctor.User.LastName}"
                    : string.Empty,
                Email = doctor.User?.Email ?? string.Empty,
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

        public async Task<DoctorResponseDto?> UpdateAsync(int id, DoctorUpdateDto dto)
        {
            var doctor = await _doctorRepository.GetByIdAsync(id);

            if (doctor == null)
                return null;

            if (!string.IsNullOrWhiteSpace(dto.Specialization))
                doctor.Specialization = dto.Specialization;

            if (!string.IsNullOrWhiteSpace(dto.Bio))
                doctor.Bio = dto.Bio;

            if (!string.IsNullOrWhiteSpace(dto.AvailableDays))
                doctor.AvailableDays = dto.AvailableDays;

            if (dto.StartTime != null)
                doctor.StartTime = dto.StartTime;

            if (dto.EndTime != null)
                doctor.EndTime = dto.EndTime;

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
                return false;

            return await _doctorRepository.DeleteAsync(id);
        }
    }
}