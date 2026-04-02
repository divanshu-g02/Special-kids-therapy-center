using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.Models
{
    public enum Roles
    {
        Admin,
        Receptionist,
        Doctor,
        Patient,
        Guardian
    }
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public Roles Role { get; set; }
        public string? PhoneNo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;


        public Doctor? Doctor { get; set; }
        public ICollection<Patient> Patients { get; set; } = [];
        public ICollection<Appointment> ReceptionistAppointments { get; set; } = [];
    }

    
}
