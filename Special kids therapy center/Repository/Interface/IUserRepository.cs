using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IUserRepository
    {
        //Task<User?> GetByIdAsync(int id);
        //Task<User?> GetByEmailAsync(string email);
        //Task<IQueryable<User>> GetByRoleAsync(Roles role);
        //Task<IQueryable<User>> GetAllActiveUsersAsync();
        //Task<bool> EmailExistsAsync(string email);

        IQueryable<User> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(int id);
    }
}
