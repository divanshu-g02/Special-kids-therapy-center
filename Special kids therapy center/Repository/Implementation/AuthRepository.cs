using Microsoft.EntityFrameworkCore;
using Special_kids_therapy_center.Data;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Implementation
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

    
        public async Task<User> RegisterAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
