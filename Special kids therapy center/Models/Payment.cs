using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Special_kids_therapy_center.Models
{
    public enum Methods
    {
        Credit_Card,
        Cash,
        Insurance
    }
    public enum PaymentStatus
    {
        Paid,
        Failed,
        Refunded,
        Pending
    }
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        public int AppointmentId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public Methods? PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey(nameof(AppointmentId))]
        public Appointment Appointment { get; set; } = null!;

    }
}
