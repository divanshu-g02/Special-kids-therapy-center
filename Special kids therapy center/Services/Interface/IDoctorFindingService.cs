using Special_kids_therapy_center.DTOs.DoctorFinding;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface IDoctorFindingService
    {
        Task<List<DoctorFindingResponseDto>> GetAllAsync();
        Task<DoctorFindingResponseDto?> GetByIdAsync(int id);
        Task<DoctorFindingResponseDto> CreateAsync(DoctorFindingCreateDto dto);
        Task<DoctorFindingResponseDto> UpdateAsync(int id, DoctorFindingUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
