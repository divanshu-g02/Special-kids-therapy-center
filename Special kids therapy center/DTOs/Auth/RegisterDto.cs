using Special_kids_therapy_center.Models;
using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.Auth
{
    public class RegisterDto
    {
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
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        public Roles Role { get; set; }

        [MaxLength(20)]
        public string? PhoneNo { get; set; }
    }
}
