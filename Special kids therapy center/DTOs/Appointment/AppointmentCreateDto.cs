using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.Appointment
{
    public class AppointmentCreateDto
    {
        public int PatientId { get; set; }

        public int DoctorId { get; set; }

        public int TherapyId { get; set; }

        public int? ReceptionistId { get; set; }

        public int? SlotId { get; set; }

        public DateOnly AppointmentDate { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public string? Notes { get; set; }
    }
}
