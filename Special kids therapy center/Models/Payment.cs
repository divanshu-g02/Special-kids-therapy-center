

namespace Special_kids_therapy_center.Models
{
    public enum PaymentMethod
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

        public int PaymentId { get; set; }
        public int AppointmentId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Appointment Appointment { get; set; } = null!;

    }
}
