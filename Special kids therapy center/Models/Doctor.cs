using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }

        [Required]
        public User UserId { get; set; }


        [MaxLength(100)]
        public string Specialization { get; set; }

        public string? Bio { get; set; }

        [MaxLength(50)]
        public string? AvailableDays { get; set; }

        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }



        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null;
        public ICollection<Slot> Slots { get; set; } = [];
        public ICollection<Appointment> Appointments = [];
    }
}
