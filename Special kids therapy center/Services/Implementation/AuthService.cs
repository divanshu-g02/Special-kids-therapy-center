using Microsoft.Extensions.Options;
using Special_kids_therapy_center.DTOs.Auth;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;
using Special_kids_therapy_center.Helper;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IAuthRepository authRepository, IJwtService jwtService, IOptions<JwtSettings> jwtSettings)
        {
            _authRepository = authRepository;
            _jwtService = jwtService;
            _jwtSettings = jwtSettings.Value;
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
                ExpiresAt = DateTime.Now.AddDays(_jwtSettings.ExpiryInDays)
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            var exists = await _authRepository.EmailExistsAsync(dto.Email);
            if (exists)
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
                ExpiresAt = DateTime.Now.AddDays(_jwtSettings.ExpiryInDays)
            };
        }
    }
}