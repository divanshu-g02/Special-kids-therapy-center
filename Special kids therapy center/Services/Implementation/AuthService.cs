using Special_kids_therapy_center.DTOs.Auth;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtService _jwtService;        

        public AuthService(IAuthRepository authRepository, IJwtService jwtService)
        {
            _authRepository = authRepository;
            _jwtService = jwtService;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _authRepository.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new UnauthorizedAccessException("Invalid email or password");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password");

            var token = _jwtService.GenerateToken(user);  

            return new AuthResponseDto
            {
                Email = user.Email,
                FullName = $"{user.FirstName} {user.LastName}",
                Role = user.Role.ToString(),
                Token = token,                             
                ExpiresAt = DateTime.Now.AddDays(1)
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var exists = await _authRepository.GetByEmailAsync(dto.Email);
            if (exists == null)
                throw new InvalidOperationException("Email already registered");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                PhoneNo = dto.PhoneNo,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            await _authRepository.RegisterAsync(user);

            var token = _jwtService.GenerateToken(user);  

            return new AuthResponseDto
            {
                Email = user.Email,
                FullName = $"{user.FirstName} {user.LastName}",
                Role = user.Role.ToString(),
                Token = token,                             
                ExpiresAt = DateTime.Now.AddDays(1)
            };
        }
    }
}