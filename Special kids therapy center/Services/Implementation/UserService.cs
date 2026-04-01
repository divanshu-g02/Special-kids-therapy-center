using Special_kids_therapy_center.DTOs.User;
using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.Repository.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace Special_kids_therapy_center.Services.Implementation
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<UserResponseDto>> GetAllAsync()
        {
            return await _repo.GetAllAsync()
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    Role = u.Role,
                    PhoneNo = u.PhoneNo,
                    CreatedAt = u.CreatedAt,
                    IsActive = u.IsActive
                }).ToListAsync();
        }

        public async Task<UserResponseDto?> GetByIdAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found");

            return new UserResponseDto
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                PhoneNo = user.PhoneNo,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive
            };
        }

        public async Task<UserResponseDto> CreateAsync(UserCreateDto dto)
        {
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

            var created = await _repo.CreateAsync(user);

            return new UserResponseDto
            {
                UserId = created.UserId,
                FirstName = created.FirstName,
                LastName = created.LastName,
                Email = created.Email,
                Role = created.Role,
                PhoneNo = created.PhoneNo,
                CreatedAt = created.CreatedAt,
                IsActive = created.IsActive
            };
        }

        public async Task<UserResponseDto> UpdateAsync(int id, UserUpdateDto dto)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found");

            if (dto.FirstName != null) user.FirstName = dto.FirstName;
            if (dto.LastName != null) user.LastName = dto.LastName;
            if (dto.PhoneNo != null) user.PhoneNo = dto.PhoneNo;
            if (dto.IsActive != null) user.IsActive = dto.IsActive.Value;

            var updated = await _repo.UpdateAsync(user);

            return new UserResponseDto
            {
                UserId = updated.UserId,
                FirstName = updated.FirstName,
                LastName = updated.LastName,
                Email = updated.Email,
                Role = updated.Role,
                PhoneNo = updated.PhoneNo,
                CreatedAt = updated.CreatedAt,
                IsActive = updated.IsActive
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID {id} not found");

            return await _repo.DeleteAsync(id);
        }
    }
}
