using Special_kids_therapy_center.DTOs.Payment;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface IPaymentService
    {
        Task<List<PaymentResponseDto>> GetAllAsync();
        Task<PaymentResponseDto?> GetByIdAsync(int id);
        Task<PaymentResponseDto> CreateAsync(PaymentCreateDto dto);
        Task<PaymentResponseDto> UpdateAsync(int id, PaymentUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
