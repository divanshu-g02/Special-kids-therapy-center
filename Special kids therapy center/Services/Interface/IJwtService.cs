using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Services.Interface
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}