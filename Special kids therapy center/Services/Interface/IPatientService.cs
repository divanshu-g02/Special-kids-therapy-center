using Special_kids_therapy_center.DTOs.Patient;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface IPatientService
    {
        Task<List<PatientResponseDto>> GetAllAsync();
        Task<PatientResponseDto?> GetByIdAsync(int id);
        Task<PatientResponseDto> CreateAsync(PatientCreateDto dto);
        Task<PatientResponseDto> UpdateAsync(int id, PatientUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
