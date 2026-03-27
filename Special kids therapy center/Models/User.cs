using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.Models
{
    public enum Roles
    {
        Admin,
        Receptionist,
        Doctor,
        Patient,
        Guardian
    }
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required]
        public Roles Role { get; set; }

        [MaxLength(20)]
        public string? PhoneNo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;



        public ICollection<Patients> Patients { get; set; }
        public Doctors Doctor { get; set; }
    }

    
}
