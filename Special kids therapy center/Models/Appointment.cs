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
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public int TherapyId { get; set; }
        public int? SlotId { get; set; }
        public int ReceptionistId { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public Status Status { get; set; } = Status.Scheduled;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        //Navigation
        public Patient Patient { get; set; } = null!;
        public Doctor Doctor { get; set; } = null!;
        public Therapy Therapy { get; set; }
        public Slot? Slot { get; set; }
        public User? Receptionist { get; set; }
        public DoctorFinding DoctorFinding { get; set; }
        public Payment Payment { get; set; }
    }
}
