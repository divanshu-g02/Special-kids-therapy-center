using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Patient;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public async Task<List<PatientResponseDto>> GetAllAsync()
        {
            return await _patientRepository.GetAllAsync()
                .Include(p => p.Guardian)
                .Select(p => new PatientResponseDto
                {
                    PatientId = p.PatientId,
                    GuardianId = p.GuardianId,
                    GuardianName = p.Guardian != null
                        ? $"{p.Guardian.FirstName} {p.Guardian.LastName}"
                        : null,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    DateOfBirth = p.DateOfBirth,
                    Gender = p.Gender,
                    MedicalHistory = p.MedicalHistory,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();
        }

        public async Task<PatientResponseDto?> GetByIdAsync(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null)
                throw new KeyNotFoundException($"Patient with ID {id} not found");

            return new PatientResponseDto
            {
                PatientId = patient.PatientId,
                GuardianId = patient.GuardianId,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                MedicalHistory = patient.MedicalHistory,
                CreatedAt = patient.CreatedAt
            };
        }

        public async Task<PatientResponseDto> CreateAsync(PatientCreateDto dto)
        {
            var patient = new Patient
            {
                GuardianId = dto.GuardianId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                MedicalHistory = dto.MedicalHistory,
                CreatedAt = DateTime.Now
            };

            var created = await _patientRepository.CreateAsync(patient);

            return new PatientResponseDto
            {
                PatientId = created.PatientId,
                GuardianId = created.GuardianId,
                FirstName = created.FirstName,
                LastName = created.LastName,
                DateOfBirth = created.DateOfBirth,
                Gender = created.Gender,
                MedicalHistory = created.MedicalHistory,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<PatientResponseDto> UpdateAsync(int id, PatientUpdateDto dto)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null)
                throw new KeyNotFoundException($"Patient with ID {id} not found");

            if (dto.GuardianId != null) patient.GuardianId = dto.GuardianId;
            if (dto.FirstName != null) patient.FirstName = dto.FirstName;
            if (dto.LastName != null) patient.LastName = dto.LastName;
            if (dto.DateOfBirth != null) patient.DateOfBirth = dto.DateOfBirth.Value;
            if (dto.Gender != null) patient.Gender = dto.Gender.Value;
            if (dto.MedicalHistory != null) patient.MedicalHistory = dto.MedicalHistory;

            var updated = await _patientRepository.UpdateAsync(patient);

            return new PatientResponseDto
            {
                PatientId = updated.PatientId,
                GuardianId = updated.GuardianId,
                FirstName = updated.FirstName,
                LastName = updated.LastName,
                DateOfBirth = updated.DateOfBirth,
                Gender = updated.Gender,
                MedicalHistory = updated.MedicalHistory,
                CreatedAt = updated.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null)
                throw new KeyNotFoundException($"Patient with ID {id} not found");

            return await _patientRepository.DeleteAsync(id);
        }
    }
}