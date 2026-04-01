using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AppDbContext _context;

        public AppointmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Appointment> GetAllAsync()
        {
            return _context.Appointments;
        }

        public async Task<Appointment?> GetByIdAsync(int id)
        {
            return await _context.Appointments
                .FirstOrDefaultAsync(a => a.AppointmentId == id);
        }

        public async Task<Appointment> CreateAsync(Appointment appointment)
        {
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment> UpdateAsync(Appointment appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var appointment = await GetByIdAsync(id);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
