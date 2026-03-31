using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public int PaymentId { get; set; }
        public int AppointmentId { get; set; }
        public string PatientName { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public string? TransactionId { get; set; }
        public PaymentStatus Status { get; set; }
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
