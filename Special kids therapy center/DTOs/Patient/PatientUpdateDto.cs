using Special_kids_therapy_center.Models;
using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.Patient
{
    public class PatientUpdateDto
    {
        public int? GuardianId { get; set; }        
        [MaxLength(50)]
        public string? FirstName { get; set; }

        [MaxLength(50)]
        public string? LastName { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public Gender? Gender { get; set; }

        public string? MedicalHistory { get; set; }
    }
}
