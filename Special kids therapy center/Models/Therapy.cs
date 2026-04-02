using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.Models
{
    public class Therapy
    {
        public int TherapyId { get; set; }
        public string Name { get; set; }

        public string? Description { get; set; }

        public int DurationMinutes { get; set; }

        public decimal Cost { get; set; }

        public ICollection<Appointment> Appointments { get; set; } = [];
    }
}
