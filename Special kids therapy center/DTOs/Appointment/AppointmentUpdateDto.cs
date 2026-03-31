using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.DTOs.Appointment
{
    public class AppointmentUpdateDto
    {
        public DateOnly? AppointmentDate { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public Status? Status { get; set; }         
        public string? Notes { get; set; }
    }
}
