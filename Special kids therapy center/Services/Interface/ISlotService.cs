using Special_kids_therapy_center.DTOs.Slot;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface ISlotService
    {
        Task<List<SlotResponseDto>> GetAllAsync();
        Task<SlotResponseDto?> GetByIdAsync(int id);
        Task<SlotResponseDto> CreateAsync(SlotCreateDto dto);
        Task<SlotResponseDto> UpdateAsync(int id, SlotUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
