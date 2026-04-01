using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IAppointmentRepository
    {
        Task<Appointment?> GetByIdAsync(int id);
        //Task<Appointment?> GetAppointmentWithDetailsAsync(int appointmentId);
        Task<IQueryable<Appointment>> GetAllAsync();
        //Task<IQueryable<Appointment>> GetAppointmentsByPatientAsync(int patientId);
        //Task<IQueryable<Appointment>> GetAppointmentsByDoctorAsync(int doctorId);
        //Task<IQueryable<Appointment>> GetAppointmentsByDateAsync(DateOnly date);
        //Task<IQueryable<Appointment>> GetAppointmentsByStatusAsync(Status status);
        Task<Appointment> CreateAsync(Appointment appointment);
        Task<Appointment> UpdateAsync(Appointment appointment);
        Task<bool> DeleteAsync(int id);


    }
}
