using Special_kids_therapy_center.Models;
using System.ComponentModel.DataAnnotations;

namespace Special_kids_therapy_center.DTOs.Payment
{
    public class PaymentUpdateDto
    {
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus? Status { get; set; }     
        public string? TransactionId { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}
