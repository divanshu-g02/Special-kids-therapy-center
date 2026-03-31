using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.DTOs.User
{
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public Roles Role { get; set; }
        public string? PhoneNo { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }
}
