using System.ComponentModel.DataAnnotations;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.DTOs.Payment
{
    public class PaymentCreateDto
    {
        public int AppointmentId { get; set; }
        public decimal Amount { get; set; }

        public PaymentMethod? PaymentMethod { get; set; }

        [MaxLength(100)]
        public string? TransactionId { get; set; }
    }
}
