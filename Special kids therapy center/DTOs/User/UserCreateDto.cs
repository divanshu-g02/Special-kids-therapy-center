using Special_kids_therapy_center.Models;
using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.User
{
    public class UserCreateDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public Roles Role { get; set; }
        public string? PhoneNo { get; set; }
    }
}
