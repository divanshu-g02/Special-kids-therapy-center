namespace Special_kids_therapy_center.Models
{
    public class Doctor
    {
        public int DoctorId { get; set; }
        public int UserId { get; set; }
        public string? Specialization { get; set; }
        public string? Bio { get; set; }
        public string? AvailableDays { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }



        public User User { get; set; } = null!;
        public ICollection<Slot> Slots { get; set; } = new List<Slot>();
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}
