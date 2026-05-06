using Special_kids_therapy_center.DTOs.Doctor;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface IDoctorService
    {
        Task<List<DoctorResponseDto>> GetAllAsync();
        Task<DoctorResponseDto?> GetByIdAsync(int id);
        Task<DoctorResponseDto?> GetByUserIdAsync(int userId);
        Task<DoctorResponseDto> CreateAsync(DoctorCreateDto dto);
        Task<DoctorResponseDto> UpdateAsync(int id, DoctorUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
