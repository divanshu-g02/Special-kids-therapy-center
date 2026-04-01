using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class DoctorFindingRepository : IDoctorFindingRepository
    {
        private readonly AppDbContext _context;

        public DoctorFindingRepository(AppDbContext context)
        {
            _context = context;
        }


        public IQueryable<DoctorFinding> GetAllAsync()
        {
            return _context.DoctorFindings;
        }

        public async Task<DoctorFinding?> GetByIdAsync(int id)
        {
            return await _context.DoctorFindings
                .FirstOrDefaultAsync(df => df.FindingId == id);
        }

        public async Task<DoctorFinding> CreateAsync(DoctorFinding doctorFinding)
        {
            await _context.DoctorFindings.AddAsync(doctorFinding);
            await _context.SaveChangesAsync();
            return doctorFinding;
        }

        public async Task<DoctorFinding> UpdateAsync(DoctorFinding doctorFinding)
        {
            _context.DoctorFindings.Update(doctorFinding);
            await _context.SaveChangesAsync();
            return doctorFinding;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var finding = await GetByIdAsync(id);
            if (finding == null) return false;

            _context.DoctorFindings.Remove(finding);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
