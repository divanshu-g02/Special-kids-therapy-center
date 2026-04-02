using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> entity)
        {
            entity.HasKey(a => a.AppointmentId);

            entity.Property(a => a.AppointmentDate)
                .IsRequired();

            entity.Property(a => a.StartTime)
                .IsRequired();

            entity.Property(a => a.EndTime)
                .IsRequired();

            entity.Property(a => a.Status)
                .HasConversion<string>()
                .HasDefaultValue(Status.Scheduled);



            // ─── Relationships ────────────────────────────
            entity.HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Therapy)
                .WithMany(t => t.Appointments)
                .HasForeignKey(a => a.TherapyId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Receptionist)
                .WithMany(u => u.ReceptionistAppointments)
                .HasForeignKey(a => a.ReceptionistId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(a => a.Slot)
                .WithOne(s => s.Appointment)
                .HasForeignKey<Appointment>(a => a.SlotId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}