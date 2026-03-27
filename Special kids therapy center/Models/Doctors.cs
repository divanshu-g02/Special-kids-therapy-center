using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public class Doctors
    {
        [Key]
        public int DoctorId { get; set; }

        public User UserId { get; set; }


        [MaxLength(100)]
        public string Specialization { get; set; }

        public string? Bio { get; set; }

        [MaxLength(50)]
        public string? AvailableDays { get; set; }

        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }



        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
