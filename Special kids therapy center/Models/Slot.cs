using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public class Slot
    {
        [Key]
        public int SlotId { get; set; }

        public int DoctorId { get; set; }
      

        public DateOnly Date { get; set; }

        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public bool IsBooked { get; set; }

        [ForeignKey(nameof(DoctorId))]
        public Doctor Doctor { get; set; } = null!;
        public Appointment? Appointment { get; set; }
    }
}
