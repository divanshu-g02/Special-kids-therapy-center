using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Appointment;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;
using System.Security.Claims;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IAppointmentRepository _appointmentRepository;

        public AppointmentService(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        // 🔥 FIX: support optional patient filtering (important for frontend security later)
        public async Task<List<AppointmentResponseDto>> GetAllAsync(int? patientId = null)
        {
            var query = _appointmentRepository.GetAllAsync()
                .Include(a => a.Patient)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Therapy)
                .Include(a => a.Receptionist)
                .AsQueryable();

            // 🔐 IMPORTANT: filter if patientId provided
            if (patientId != null)
            {
                query = query.Where(a => a.PatientId == patientId);
            }

            return await query
                .Select(a => new AppointmentResponseDto
                {
                    AppointmentId = a.AppointmentId,
                    PatientId = a.PatientId,
                    PatientName = a.Patient != null
                        ? $"{a.Patient.FirstName} {a.Patient.LastName}"
                        : null,

                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor != null
                        ? $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}"
                        : null,

                    TherapyId = a.TherapyId,
                    TherapyName = a.Therapy != null ? a.Therapy.Name : null,

                    ReceptionistId = a.ReceptionistId,
                    ReceptionistName = a.Receptionist != null
                        ? $"{a.Receptionist.FirstName} {a.Receptionist.LastName}"
                        : null,

                    AppointmentDate = a.AppointmentDate,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime,
                    Status = a.Status,
                    Notes = a.Notes,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<AppointmentResponseDto?> GetByIdAsync(int id)
        {
            var a = await _appointmentRepository.GetByIdQueryable(id)
                .Include(a => a.Patient)
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.Therapy)
                .Include(a => a.Receptionist)
                .FirstOrDefaultAsync();

            if (a == null)
                throw new KeyNotFoundException($"Appointment with ID {id} not found");

            return new AppointmentResponseDto
            {
                AppointmentId = a.AppointmentId,
                PatientId = a.PatientId,
                PatientName = a.Patient != null ? $"{a.Patient.FirstName} {a.Patient.LastName}" : null,
                DoctorId = a.DoctorId,
                DoctorName = a.Doctor != null ? $"{a.Doctor.User.FirstName} {a.Doctor.User.LastName}" : null,
                TherapyId = a.TherapyId,
                TherapyName = a.Therapy != null ? a.Therapy.Name : null,
                ReceptionistId = a.ReceptionistId,
                ReceptionistName = a.Receptionist != null ? $"{a.Receptionist.FirstName} {a.Receptionist.LastName}" : null,
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
            if (dto.EndTime <= dto.StartTime)
                throw new ArgumentException("End time must be after start time");

            var existingAppointments = await _appointmentRepository.GetAllAsync()
                .Where(a =>
                    a.DoctorId == dto.DoctorId &&
                    a.AppointmentDate == dto.AppointmentDate &&
                    a.Status != Status.Cancelled &&
                    (
                        dto.StartTime < a.EndTime &&
                        dto.EndTime > a.StartTime
                    ))
                .ToListAsync();

            if (existingAppointments.Any())
                throw new InvalidOperationException("Doctor already has an appointment in this time range");

            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                TherapyId = dto.TherapyId,
                ReceptionistId = dto.ReceptionistId,
                SlotId = dto.SlotId,
                AppointmentDate = dto.AppointmentDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Notes = dto.Notes,
                Status = Status.Scheduled,
                CreatedAt = DateTime.Now
            };

            var created = await _appointmentRepository.CreateAsync(appointment);

            if (dto.SlotId.HasValue)
            {
                await _appointmentRepository.MarkSlotBookedAsync(dto.SlotId.Value);
            }

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

            if (dto.AppointmentDate.HasValue)
                appointment.AppointmentDate = dto.AppointmentDate.Value;

            if (dto.StartTime.HasValue)
                appointment.StartTime = dto.StartTime.Value;

            if (dto.EndTime.HasValue)
                appointment.EndTime = dto.EndTime.Value;

            if (dto.Status.HasValue)
                appointment.Status = dto.Status.Value;

            if (!string.IsNullOrEmpty(dto.Notes))
                appointment.Notes = dto.Notes;

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