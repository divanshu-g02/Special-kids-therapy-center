using Special_kids_therapy_center.DTOs.Therapy;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface ITherapyService
    {
        Task<List<TherapyResponseDto>> GetAllAsync();
        Task<TherapyResponseDto?> GetByIdAsync(int id);
        Task<TherapyResponseDto> CreateAsync(TherapyCreateDto dto);
        Task<TherapyResponseDto> UpdateAsync(int id, TherapyUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
