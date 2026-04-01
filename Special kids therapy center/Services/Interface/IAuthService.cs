using Special_kids_therapy_center.DTOs.Auth;
namespace Special_kids_therapy_center.Services.Interface
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
    }
}
