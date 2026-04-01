using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Repository.Interface;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        }

        //public async Task<User?> GetByEmailAsync(string email)
        //{
        //    return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        //}

        public  IQueryable<User> GetAllAsync()
        {
            return _context.Users.AsNoTracking();
        }
        //public async Task<IQueryable<User>> GetByRoleAsync(Roles role)
        //{
        //    return await _context.Users.Where(u => u.Role == role).ToListAsync();
        //}

        //public async Task<IQueryable<User>> GetAllActiveUsersAsync()
        //{
        //    return await _context.Users.Where(u => u.IsActive == true).ToListAsync();
        //}

        public async Task<User> CreateAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FirstAsync(x => x.UserId ==  id);
            if (user == null) return false;

             _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        //public async Task<bool> EmailExistsAsync(string email)
        //{
        //    return await _context.Users.AnyAsync(u => u.Email == email);
        //}
    }
}
