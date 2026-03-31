namespace Special_kids_therapy_center.DTOs.DoctorFinding
{
    public class DoctorFindingCreateDto
    {
        public int AppointmentId { get; set; }

        public string? Observations { get; set; }

        public string? Recommendations { get; set; }

        public DateOnly? NextSessionDate { get; set; }
    }
}
