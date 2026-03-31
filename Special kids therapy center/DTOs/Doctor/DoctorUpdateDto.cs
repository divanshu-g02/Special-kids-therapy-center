using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.Doctor
{
    public class DoctorUpdateDto
    {
        public string? Specialization { get; set; }

        public string? Bio { get; set; }
        public string? AvailableDays { get; set; }

        public TimeOnly? StartTime { get; set; }

        public TimeOnly? EndTime { get; set; }
    }
}
