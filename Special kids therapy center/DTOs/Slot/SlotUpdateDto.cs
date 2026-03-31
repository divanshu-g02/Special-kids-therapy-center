namespace Special_kids_therapy_center.DTOs.Slot
{
    public class SlotUpdateDto
    {
        public DateOnly? Date { get; set; }
        public TimeOnly? StartTime { get; set; }
        public TimeOnly? EndTime { get; set; }
        public bool? IsBooked { get; set; }
    }
}
