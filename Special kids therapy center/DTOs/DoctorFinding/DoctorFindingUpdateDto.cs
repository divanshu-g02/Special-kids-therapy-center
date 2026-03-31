namespace Special_kids_therapy_center.DTOs.DoctorFinding
{
    public class DoctorFindingUpdateDto
    {
        public string? Observations { get; set; }
        public string? Recommendations { get; set; }
        public DateOnly? NextSessionDate { get; set; }
    }
}
