using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> entity)
        {
            entity.HasKey(d => d.DoctorId);

            entity.Property(d => d.Specialization)
                .HasMaxLength(100);

            entity.Property(d => d.AvailableDays)
                .HasMaxLength(50);

            entity.HasOne(d => d.User)
                .WithOne(u => u.Doctor)
                .HasForeignKey<Doctor>(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
