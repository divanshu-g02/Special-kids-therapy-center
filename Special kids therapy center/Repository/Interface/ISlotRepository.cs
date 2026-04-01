using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface ISlotRepository
    {
        Task<Slot?> GetByIdAsync(int id);
        Task<IEnumerable<Slot>> GetAllAsync();
        Task<IEnumerable<Slot>> GetSlotsByDoctorAsync(int doctorId);
        Task<IEnumerable<Slot>> GetAvailableSlotsByDoctorAsync(int doctorId);
        Task<IEnumerable<Slot>> GetSlotsByDateAsync(DateOnly date);
        Task<bool> IsSlotAvailableAsync(int slotId);
        Task<Slot> CreateAsync(Slot slot);
        Task<Slot> UpdateAsync(Slot slot);
        Task<bool> DeleteAsync(int id);
    }
}
