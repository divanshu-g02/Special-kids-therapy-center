using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class SlotConfiguration : IEntityTypeConfiguration<Slot>
    {
        public void Configure(EntityTypeBuilder<Slot> entity)
        {
            entity.HasKey(s => s.SlotId);

            entity.Property(s => s.Date)
                .IsRequired();

            entity.Property(s => s.StartTime)
                .IsRequired();

            entity.Property(s => s.EndTime)
                .IsRequired();

            entity.Property(s => s.IsBooked)
                .HasDefaultValue(false);

            entity.HasOne(s => s.Doctor)
                .WithMany(d => d.Slots)
                .HasForeignKey(s => s.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}