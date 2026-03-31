namespace Special_kids_therapy_center.DTOs.Therapy
{
    public class TherapyResponseDto
    {
        public int TherapyId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public int DurationMinutes { get; set; }
        public decimal Cost { get; set; }
    }
}
