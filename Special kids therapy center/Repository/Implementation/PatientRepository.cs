using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class PatientRepository : IPatientRepository
    {
        private readonly AppDbContext _context;

        public PatientRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Patient> GetAllAsync()
        {
            return _context.Patients;
        }

        public async Task<Patient?> GetByIdAsync(int id)
        {
            return await _context.Patients
                .FirstOrDefaultAsync(p => p.PatientId == id);
        }

        public async Task<Patient> CreateAsync(Patient patient)
        {
            await _context.Patients.AddAsync(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient> UpdateAsync(Patient patient)
        {
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var patient = await GetByIdAsync(id);
            if (patient == null) return false;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
