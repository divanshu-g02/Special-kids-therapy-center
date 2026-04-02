using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> entity)
        {
            entity.HasKey(p => p.PatientId);

            entity.Property(p => p.FirstName)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(p => p.LastName)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(p => p.Gender)
                .HasConversion<string>();


            entity.HasOne(p => p.Guardian)
                .WithMany(u => u.Patients)
                .HasForeignKey(p => p.GuardianId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}