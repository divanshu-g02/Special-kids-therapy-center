using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.Slot
{
    public class SlotCreateDto
    {
        public int DoctorId { get; set; }

        public DateOnly Date { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }
    }
}
