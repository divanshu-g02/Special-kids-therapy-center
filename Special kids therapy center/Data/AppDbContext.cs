using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.Data.Configrations;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Therapy> Therapies { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<DoctorFinding> DoctorFindings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Slot> Slots { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}
