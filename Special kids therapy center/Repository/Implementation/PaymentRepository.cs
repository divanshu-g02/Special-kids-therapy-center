using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AppDbContext _context;

        public PaymentRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Payment> GetAllAsync()
        {
            return _context.Payments;
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.PaymentId == id);
        }

        public async Task<Payment> CreateAsync(Payment payment)
        {
            await _context.Payments.AddAsync(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment> UpdateAsync(Payment payment)
        {
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var payment = await GetByIdAsync(id);
            if (payment == null) return false;

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
