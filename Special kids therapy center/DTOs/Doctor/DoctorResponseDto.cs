namespace Special_kids_therapy_center.DTOs.Doctor
{
    public class DoctorResponseDto
    {
        public int DoctorId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; }        
        public string Email { get; set; }   
        public string? Specialization { get; set; }
        public string? Bio { get; set; }
        public string? AvailableDays { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
    }
}
