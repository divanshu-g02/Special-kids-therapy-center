using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IAppointmentRepository
    {
        IQueryable<Appointment> GetAllAsync();
        Task<Appointment?> GetByIdAsync(int id);
        IQueryable<Appointment> GetByIdQueryable(int id);
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<Appointment> UpdateAsync(Appointment appointment);
        Task<bool> DeleteAsync(int id);
        Task MarkSlotBookedAsync(int slotId);
    }
}
