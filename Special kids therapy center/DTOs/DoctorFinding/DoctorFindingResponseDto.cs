namespace Special_kids_therapy_center.DTOs.DoctorFinding
{
    public class DoctorFindingResponseDto
    {
        public int FindingId { get; set; }
        public int AppointmentId { get; set; }
        public string PatientName { get; set; }   
        public string DoctorName { get; set; }  
        public string? Observations { get; set; }
        public string? Recommendations { get; set; }
        public DateOnly? NextSessionDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
