using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public class DoctorFinding
    {
        public int FindingId { get; set; }
        public int AppointmentId { get; set; }
        public string? Observations { get; set; }
        public string? Recommendations { get; set; }
        public DateOnly? NextSessionDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //Navigations
        public Appointment Appointment { get; set; } = null!;
    }
}
