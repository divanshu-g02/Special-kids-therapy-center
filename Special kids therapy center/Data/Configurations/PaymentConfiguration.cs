using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Data.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> entity)
        {

            entity.HasKey(p => p.PaymentId);

            entity.Property(p => p.Amount)
                  .IsRequired()
                  .HasColumnType("decimal(10,2)");     

            entity.Property(p => p.PaymentMethod)
                  .HasConversion<string>();             

            entity.Property(p => p.TransactionId)
                  .HasMaxLength(100);

            entity.Property(p => p.Status)
                  .HasConversion<string>()             
                  .HasDefaultValue(PaymentStatus.Pending);

            entity.Property(p => p.CreatedAt)
                  .HasDefaultValueSql("GETDATE()");

           
            entity.HasOne(p => p.Appointment)
                  .WithOne(a => a.Payment)
                  .HasForeignKey<Payment>(p => p.AppointmentId)
                  .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
