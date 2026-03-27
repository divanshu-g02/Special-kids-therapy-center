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
    public class Patients
    {
        [Key]
        public int PatientId { get; set; }

        [ForeignKey("Guardian")]
        public int GuardianId { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }
        public DateOnly DateOfBirth { get; set; }

        public Gender Gender { get; set; }

        public string? MedicalHistory { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User Guardian { get; set; }
    }
}
