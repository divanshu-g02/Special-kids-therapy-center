using Special_kids_therapy_center.DTOs.Appointment;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface IAppointmentService
    {
        Task<List<AppointmentResponseDto>> GetAllAsync();
        Task<AppointmentResponseDto?> GetByIdAsync(int id);
        Task<AppointmentResponseDto> CreateAsync(AppointmentCreateDto dto);
        Task<AppointmentResponseDto> UpdateAsync(int id, AppointmentUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
