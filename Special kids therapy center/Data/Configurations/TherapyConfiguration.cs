using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class TherapyConfiguration : IEntityTypeConfiguration<Therapy>
    {
        public void Configure(EntityTypeBuilder<Therapy> entity)
        {
            entity.HasKey(t => t.TherapyId);

            entity.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(t => t.DurationMinutes)
                .IsRequired();

            entity.Property(t => t.Cost)
                .IsRequired()
                .HasColumnType("decimal(10,2)");
        }
    }
}
