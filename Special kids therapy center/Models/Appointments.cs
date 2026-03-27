using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public enum Status
    {
        Scheduled,
        Completed,
        Cancelled
    }
    public class Appointments
    {
        [Key]
        public int AppointmentId { get; set; }

        public int PatientId { get; set; }

        [ForeignKey("PatientId")]
        public Patients Patient { get; set; }

        
        public int DoctorId { get; set; }

        public Doctors Doctor { get; set; }

        public int TherapyId { get; set; }

        [ForeignKey("TherapyId")]
        public Therapy Therapy { get; set; }

        public int ReceptionistId { get; set; }

        [ForeignKey("User")]
        public ICollection<User> User { get; set; }

        [Required]
        public DateOnly AppointmentDate { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        [MaxLength(20)]
        public Status Status { get; set; }

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }



    }
}
