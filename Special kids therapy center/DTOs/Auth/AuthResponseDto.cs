namespace Special_kids_therapy_center.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; }           
        public string Email { get; set; }
        public string FullName { get; set; }
        public string Role { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
