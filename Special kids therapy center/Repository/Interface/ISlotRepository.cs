using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface ISlotRepository
    {
        //Task<IEnumerable<Slot>> GetSlotsByDoctorAsync(int doctorId);
        //Task<IEnumerable<Slot>> GetAvailableSlotsByDoctorAsync(int doctorId);
        //Task<IEnumerable<Slot>> GetSlotsByDateAsync(DateOnly date);
        //Task<bool> IsSlotAvailableAsync(int slotId);
    

        IQueryable<Slot> GetAllAsync();
        Task<Slot?> GetByIdAsync(int id);
        Task<Slot> CreateAsync(Slot slot);
        Task<Slot> UpdateAsync(Slot slot);
        Task<bool> DeleteAsync(int id);
    }
}
