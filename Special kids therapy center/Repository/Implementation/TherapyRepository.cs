using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class TherapyRepository : ITherapyRepository
    {
        private readonly AppDbContext _context;

        public TherapyRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Therapy> GetAllAsync()
        {
            return _context.Therapies;
        }

        public async Task<Therapy?> GetByIdAsync(int id)
        {
            return await _context.Therapies
                .FirstOrDefaultAsync(t => t.TherapyId == id);
        }

        public async Task<Therapy> CreateAsync(Therapy therapy)
        {
            await _context.Therapies.AddAsync(therapy);
            await _context.SaveChangesAsync();
            return therapy;
        }

        public async Task<Therapy> UpdateAsync(Therapy therapy)
        {
            _context.Therapies.Update(therapy);
            await _context.SaveChangesAsync();
            return therapy;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var therapy = await GetByIdAsync(id);
            if (therapy == null) return false;

            _context.Therapies.Remove(therapy);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
