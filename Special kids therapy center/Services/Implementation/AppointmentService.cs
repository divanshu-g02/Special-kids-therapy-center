using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Appointment;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        public async Task<List<AppointmentResponseDto>> GetAllAsync()
        {
            return await _appointmentRepository.GetAllAsync()
                .Include(a => a.Patient)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Therapy)
                .Include(a => a.Receptionist)
                .Select(a => new AppointmentResponseDto
                {
                    AppointmentId = a.AppointmentId,
                    PatientId = a.PatientId,
                    PatientName = $"{a.Patient.FirstName} {a.Patient.LastName}",
                    DoctorId = a.DoctorId,
                    DoctorName = $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}",
                    TherapyId = a.TherapyId,
                    TherapyName = a.Therapy.Name,
                    ReceptionistId = a.ReceptionistId,
                    ReceptionistName = $"{a.Receptionist.FirstName} {a.Receptionist.LastName}",
                    AppointmentDate = a.AppointmentDate,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    Status = a.Status,
                    Notes = a.Notes,
                    CreatedAt = a.CreatedAt
                }).ToListAsync();
        }

        public async Task<AppointmentResponseDto?> GetByIdAsync(int id)
        {
            var a = await _appointmentRepository.GetByIdAsync(id);
            if (a == null)
                throw new KeyNotFoundException($"Appointment with ID {id} not found");

            return new AppointmentResponseDto
            {
                AppointmentId = a.AppointmentId,
                PatientId = a.PatientId,
                DoctorId = a.DoctorId,
                TherapyId = a.TherapyId,
                ReceptionistId = a.ReceptionistId,
                AppointmentDate = a.AppointmentDate,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                Status = a.Status,
                Notes = a.Notes,
                CreatedAt = a.CreatedAt
            };
        }

        public async Task<AppointmentResponseDto> CreateAsync(AppointmentCreateDto dto)
        {
            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                TherapyId = dto.TherapyId,
                ReceptionistId = dto.ReceptionistId,
                AppointmentDate = dto.AppointmentDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Notes = dto.Notes,
                Status = Status.Scheduled,
                CreatedAt = DateTime.Now
            };

            var created = await _appointmentRepository.CreateAsync(appointment);

            return new AppointmentResponseDto
            {
                AppointmentId = created.AppointmentId,
                PatientId = created.PatientId,
                DoctorId = created.DoctorId,
                TherapyId = created.TherapyId,
                ReceptionistId = created.ReceptionistId,
                AppointmentDate = created.AppointmentDate,
                StartTime = created.StartTime,
                EndTime = created.EndTime,
                Status = created.Status,
                Notes = created.Notes,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<AppointmentResponseDto> UpdateAsync(int id, AppointmentUpdateDto dto)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null)
                throw new KeyNotFoundException($"Appointment with ID {id} not found");

            if (dto.AppointmentDate != null) appointment.AppointmentDate = dto.AppointmentDate.Value;
            if (dto.StartTime != null) appointment.StartTime = dto.StartTime.Value;
            if (dto.EndTime != null) appointment.EndTime = dto.EndTime.Value;
            if (dto.Status != null) appointment.Status = dto.Status.Value;
            if (dto.Notes != null) appointment.Notes = dto.Notes;

            var updated = await _appointmentRepository.UpdateAsync(appointment);

            return new AppointmentResponseDto
            {
                AppointmentId = updated.AppointmentId,
                PatientId = updated.PatientId,
                DoctorId = updated.DoctorId,
                TherapyId = updated.TherapyId,
                ReceptionistId = updated.ReceptionistId,
                AppointmentDate = updated.AppointmentDate,
                StartTime = updated.StartTime,
                EndTime = updated.EndTime,
                Status = updated.Status,
                Notes = updated.Notes,
                CreatedAt = updated.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var appointment = await _appointmentRepository.GetByIdAsync(id);
            if (appointment == null)
                throw new KeyNotFoundException($"Appointment with ID {id} not found");

            return await _appointmentRepository.DeleteAsync(id);
        }
    }
}