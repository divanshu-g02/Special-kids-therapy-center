using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class DoctorFindingConfiguration : IEntityTypeConfiguration<DoctorFinding>
    {
        public void Configure(EntityTypeBuilder<DoctorFinding> entity)
        {
            entity.HasKey(f => f.FindingId);

            entity.Property(df => df.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            entity.HasOne(df => df.Appointment)
                .WithOne(a => a.DoctorFinding)
                .HasForeignKey<DoctorFinding>(df => df.AppointmentId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
