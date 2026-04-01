using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IDoctorFindingRepository
    {
        Task<DoctorFinding?> GetByIdAsync(int id);
        Task<DoctorFinding?> GetFindingWithAppointmentAsync(int findingId);
        Task<DoctorFinding?> GetFindingByAppointmentAsync(int appointmentId);
        Task<IEnumerable<DoctorFinding>> GetAllAsync();
        Task<IEnumerable<DoctorFinding>> GetFindingsByDoctorAsync(int doctorId);
        Task<IEnumerable<DoctorFinding>> GetFindingsByPatientAsync(int patientId);
        Task<DoctorFinding> CreateAsync(DoctorFinding doctorFinding);
        Task<DoctorFinding> UpdateAsync(DoctorFinding doctorFinding);
        Task<bool> DeleteAsync(int id);
    }
}
