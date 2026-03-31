using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.DTOs.Patient
{
    public class PatientResponseDto
    {
        public int PatientId { get; set; }
        public int? GuardianId { get; set; }
        public string? GuardianName { get; set; }   
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string? MedicalHistory { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
