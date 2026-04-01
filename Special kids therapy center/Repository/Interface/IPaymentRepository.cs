using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IPaymentRepository
    {
        //Task<Payment?> GetPaymentWithAppointmentAsync(int paymentId);
        //Task<Payment?> GetPaymentByAppointmentAsync(int appointmentId);
        //Task<IEnumerable<Payment>> GetPaymentsByStatusAsync(PaymentStatus status);
        //Task<IEnumerable<Payment>> GetPaymentsByPatientAsync(int patientId);
      

        IQueryable<Payment> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<Payment> CreateAsync(Payment payment);
        Task<Payment> UpdateAsync(Payment payment);
        Task<bool> DeleteAsync(int id);
    }
}
