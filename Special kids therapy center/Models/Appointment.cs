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
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }
        [Required]
        public int PatientId { get; set; }
        [Required]
        public int DoctorId { get; set; }
        [Required]
        public int TherapyId { get; set; }
      
        public int? SlotId { get; set; }
        public int ReceptionistId { get; set; }
   

        [Required]
        public DateOnly AppointmentDate { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }

        public Status Status { get; set; } = Status.Scheduled;

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //Navigation
        [ForeignKey(nameof(PatientId))]
        public Patient Patient { get; set; } = null!;

        [ForeignKey(nameof(DoctorId))]
        public Doctor Doctor { get; set; } = null!;

        [ForeignKey(nameof(TherapyId))]
        public Therapy Therapy { get; set; }

        [ForeignKey(nameof(SlotId))]
        public Slot? Slot { get; set; }

        [ForeignKey(nameof(ReceptionistId))]
        public User? Receptionist { get; set; }

        public DoctorFinding DoctorFinding { get; set; }
        public Payment Payment { get; set; }
    }
}
