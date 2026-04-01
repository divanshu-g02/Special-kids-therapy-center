using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Repository.Interface
{
    public interface IAuthRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User> RegisterAsync(User user);

    }
}
