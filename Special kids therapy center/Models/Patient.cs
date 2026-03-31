using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public enum Gender
    {
        Male,
        Female,
        Others
    }
    public class Patient
    {
        [Key]
        public int PatientId { get; set; }

        public int GuardianId { get; set; }
        

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }

        public Gender Gender { get; set; }

        public string? MedicalHistory { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey(nameof(GuardianId))]
        public User? Guardian { get; set; }
        public ICollection<Appointment> Appointments { get; set; } = [];
    }
}
