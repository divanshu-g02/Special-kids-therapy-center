using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.Models
{
    public class Therapy
    {
        [Key]
        public int TherapyId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Required]
        public int DurationMinutes { get; set; }

        [Required]
        public decimal Cost { get; set; }
    }
}
