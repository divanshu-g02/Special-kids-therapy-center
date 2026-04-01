using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IPatientRepository
    {
        //Task<Patient?> GetPatientWithGuardianAsync(int patientId);
        //Task<Patient?> GetPatientWithAppointmentsAsync(int patientId);
        //Task<IEnumerable<Patient>> GetPatientsByGuardianAsync(int guardianId);

        IQueryable<Patient> GetAllAsync();
        Task<Patient?> GetByIdAsync(int id);
        Task<Patient> CreateAsync(Patient patient);
        Task<Patient> UpdateAsync(Patient patient);
        Task<bool> DeleteAsync(int id);
    }
}
