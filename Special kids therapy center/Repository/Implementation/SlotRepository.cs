using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Models;
using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.Repository.Interface;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class SlotRepository : ISlotRepository
    {
        private readonly AppDbContext _context;

        public SlotRepository(AppDbContext context)
        {
            _context = context;
        }

        public IQueryable<Slot> GetAllAsync()
        {
            return _context.Slots;
        }

        public async Task<Slot?> GetByIdAsync(int id)
        {
            return await _context.Slots
                .FirstOrDefaultAsync(s => s.SlotId == id);
        }

        public async Task<Slot> CreateAsync(Slot slot)
        {
            await _context.Slots.AddAsync(slot);
            await _context.SaveChangesAsync();
            return slot;
        }

        public async Task<Slot> UpdateAsync(Slot slot)
        {
            _context.Slots.Update(slot);
            await _context.SaveChangesAsync();
            return slot;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var slot = await GetByIdAsync(id);
            if (slot == null) return false;

            _context.Slots.Remove(slot);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
