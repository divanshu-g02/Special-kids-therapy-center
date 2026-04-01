using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.DoctorFinding;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class DoctorFindingService : IDoctorFindingService
    {
        private readonly IDoctorFindingRepository _doctorFindingRepository;

        public DoctorFindingService(IDoctorFindingRepository doctorFindingRepository)
        {
            _doctorFindingRepository = doctorFindingRepository;
        }

        public async Task<List<DoctorFindingResponseDto>> GetAllAsync()
        {
            return await _doctorFindingRepository.GetAllAsync()
                .Include(df => df.Appointment).ThenInclude(a => a.Patient)
                .Include(df => df.Appointment).ThenInclude(a => a.Doctor).ThenInclude(d => d.User)
                .Select(df => new DoctorFindingResponseDto
                {
                    FindingId = df.FindingId,
                    AppointmentId = df.AppointmentId,
                    PatientName = $"{df.Appointment.Patient.FirstName} {df.Appointment.Patient.LastName}",
                    DoctorName = $"{df.Appointment.Doctor.User.FirstName} {df.Appointment.Doctor.User.LastName}",
                    Observations = df.Observations,
                    Recommendations = df.Recommendations,
                    NextSessionDate = df.NextSessionDate,
                    CreatedAt = df.CreatedAt
                }).ToListAsync();
        }

        public async Task<DoctorFindingResponseDto?> GetByIdAsync(int id)
        {
            var df = await _doctorFindingRepository.GetByIdAsync(id);
            if (df == null)
                throw new KeyNotFoundException($"Finding with ID {id} not found");

            return new DoctorFindingResponseDto
            {
                FindingId = df.FindingId,
                AppointmentId = df.AppointmentId,
                Observations = df.Observations,
                Recommendations = df.Recommendations,
                NextSessionDate = df.NextSessionDate,
                CreatedAt = df.CreatedAt
            };
        }

        public async Task<DoctorFindingResponseDto> CreateAsync(DoctorFindingCreateDto dto)
        {
            var finding = new DoctorFinding
            {
                AppointmentId = dto.AppointmentId,
                Observations = dto.Observations,
                Recommendations = dto.Recommendations,
                NextSessionDate = dto.NextSessionDate,
                CreatedAt = DateTime.Now
            };

            var created = await _doctorFindingRepository.CreateAsync(finding);

            return new DoctorFindingResponseDto
            {
                FindingId = created.FindingId,
                AppointmentId = created.AppointmentId,
                Observations = created.Observations,
                Recommendations = created.Recommendations,
                NextSessionDate = created.NextSessionDate,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<DoctorFindingResponseDto> UpdateAsync(int id, DoctorFindingUpdateDto dto)
        {
            var finding = await _doctorFindingRepository.GetByIdAsync(id);
            if (finding == null)
                throw new KeyNotFoundException($"Finding with ID {id} not found");

            if (dto.Observations != null) finding.Observations = dto.Observations;
            if (dto.Recommendations != null) finding.Recommendations = dto.Recommendations;
            if (dto.NextSessionDate != null) finding.NextSessionDate = dto.NextSessionDate;

            var updated = await _doctorFindingRepository.UpdateAsync(finding);

            return new DoctorFindingResponseDto
            {
                FindingId = updated.FindingId,
                AppointmentId = updated.AppointmentId,
                Observations = updated.Observations,
                Recommendations = updated.Recommendations,
                NextSessionDate = updated.NextSessionDate,
                CreatedAt = updated.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var finding = await _doctorFindingRepository.GetByIdAsync(id);
            if (finding == null)
                throw new KeyNotFoundException($"Finding with ID {id} not found");

            return await _doctorFindingRepository.DeleteAsync(id);
        }
    }
}