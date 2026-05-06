using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IDoctorRepository
    {
        //Task<Doctor?> GetDoctorWithUserAsync(int doctorId);
        //Task<Doctor?> GetDoctorWithSlotsAsync(int docotorId);
        //Task<Doctor?> GetDoctorWithAppointmentsAsync(int doctorId);
        //Task<IEnumerable<Doctor>> GetDoctorsBySpecializationAsync(string specialization);

        IQueryable<Doctor> GetAllAsync();
        IQueryable<Doctor> GetByIdQueryable(int id);
        Task<Doctor?> GetByIdAsync(int id);
        Task<Doctor> CreateAsync(Doctor doctor);
        Task<Doctor> UpdateAsync(Doctor doctor);
        Task<bool> DeleteAsync(int id);

    }
}
