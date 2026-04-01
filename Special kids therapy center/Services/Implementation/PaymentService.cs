using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.DTOs.Payment;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;

        public PaymentService(IPaymentRepository paymentRepository)
        {
            _paymentRepository = paymentRepository;
        }

        public async Task<List<PaymentResponseDto>> GetAllAsync()
        {
            return await _paymentRepository.GetAllAsync()
                .Include(p => p.Appointment).ThenInclude(a => a.Patient)
                .Select(p => new PaymentResponseDto
                {
                    PaymentId = p.PaymentId,
                    AppointmentId = p.AppointmentId,
                    PatientName = $"{p.Appointment.Patient.FirstName} {p.Appointment.Patient.LastName}",
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod,
                    TransactionId = p.TransactionId,
                    Status = p.Status,
                    PaidAt = p.PaidAt,
                    CreatedAt = p.CreatedAt
                }).ToListAsync();
        }

        public async Task<PaymentResponseDto?> GetByIdAsync(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
                throw new KeyNotFoundException($"Payment with ID {id} not found");

            return new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                AppointmentId = payment.AppointmentId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                TransactionId = payment.TransactionId,
                Status = payment.Status,
                PaidAt = payment.PaidAt,
                CreatedAt = payment.CreatedAt
            };
        }

        public async Task<PaymentResponseDto> CreateAsync(PaymentCreateDto dto)
        {
            var payment = new Payment
            {
                AppointmentId = dto.AppointmentId,
                Amount = dto.Amount,
                PaymentMethod = dto.PaymentMethod,
                TransactionId = dto.TransactionId,
                Status = PaymentStatus.Pending,
                CreatedAt = DateTime.Now
            };

            var created = await _paymentRepository.CreateAsync(payment);

            return new PaymentResponseDto
            {
                PaymentId = created.PaymentId,
                AppointmentId = created.AppointmentId,
                Amount = created.Amount,
                PaymentMethod = created.PaymentMethod,
                TransactionId = created.TransactionId,
                Status = created.Status,
                PaidAt = created.PaidAt,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<PaymentResponseDto> UpdateAsync(int id, PaymentUpdateDto dto)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
                throw new KeyNotFoundException($"Payment with ID {id} not found");

            if (dto.PaymentMethod != null) payment.PaymentMethod = dto.PaymentMethod;
            if (dto.Status != null) payment.Status = dto.Status.Value;
            if (dto.TransactionId != null) payment.TransactionId = dto.TransactionId;
            if (dto.PaidAt != null) payment.PaidAt = dto.PaidAt;

            var updated = await _paymentRepository.UpdateAsync(payment);

            return new PaymentResponseDto
            {
                PaymentId = updated.PaymentId,
                AppointmentId = updated.AppointmentId,
                Amount = updated.Amount,
                PaymentMethod = updated.PaymentMethod,
                TransactionId = updated.TransactionId,
                Status = updated.Status,
                PaidAt = updated.PaidAt,
                CreatedAt = updated.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
                throw new KeyNotFoundException($"Payment with ID {id} not found");

            return await _paymentRepository.DeleteAsync(id);
        }
    }
}