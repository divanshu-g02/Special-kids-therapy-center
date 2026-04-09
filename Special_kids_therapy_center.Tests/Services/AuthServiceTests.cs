using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Services.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IAuthRepository> _authRepoMock;
        private readonly Mock<IJwtService> _jwtServiceMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _authRepoMock = new Mock<IAuthRepository>();
            _jwtServiceMock = new Mock<IJwtService>();
            _authService = new AuthService(_authRepoMock.Object, _jwtServiceMock.Object);
        }

        [Fact]
        public async Task RegisterAsync_ValidData_ReturnsAuthResponse()
        {
            var dto = TestDataHelper.GetRegisterDto();
            _authRepoMock.Setup(r => r.EmailExistsAsync(dto.Email))
                         .ReturnsAsync(false);
            _authRepoMock.Setup(r => r.RegisterAsync(It.IsAny<User>()))
                         .ReturnsAsync((User u) => u);
            _jwtServiceMock.Setup(j => j.GenerateToken(It.IsAny<User>()))
                           .Returns("test_token");

            var result = await _authService.RegisterAsync(dto);

            result.Should().NotBeNull();
            result.Email.Should().Be(dto.Email);
            result.Token.Should().Be("test_token");
            result.FullName.Should().Be($"{dto.FirstName} {dto.LastName}");
            result.Role.Should().Be("Admin");
            result.ExpiresAt.Should().BeAfter(DateTime.Now);
        }

        [Fact]
        public async Task RegisterAsync_DuplicateEmail_ThrowsInvalidOperationException()
        {
            var dto = TestDataHelper.GetRegisterDto();
            _authRepoMock.Setup(r => r.EmailExistsAsync(dto.Email))
                         .ReturnsAsync(true);

            var act = async () => await _authService.RegisterAsync(dto);

            await act.Should().ThrowAsync<InvalidOperationException>()
                     .WithMessage("Email already registered");
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
        {
            var dto = TestDataHelper.GetLoginDto();
            var user = TestDataHelper.GetTestUser();
            _authRepoMock.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync(user);
            _jwtServiceMock.Setup(j => j.GenerateToken(user))
                           .Returns("test_token");

            var result = await _authService.LoginAsync(dto);

            result.Should().NotBeNull();
            result.Token.Should().Be("test_token");
            result.Email.Should().Be(user.Email);
            result.FullName.Should().Be($"{user.FirstName} {user.LastName}");
            result.Role.Should().Be(user.Role.ToString());
        }

        [Fact]
        public async Task LoginAsync_InvalidEmail_ThrowsUnauthorizedException()
        {
            var dto = TestDataHelper.GetLoginDto();
            _authRepoMock.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync((User?)null);

            var act = async () => await _authService.LoginAsync(dto);

            await act.Should().ThrowAsync<UnauthorizedAccessException>()
                     .WithMessage("Invalid email or password");
        }

        [Fact]
        public async Task LoginAsync_WrongPassword_ThrowsUnauthorizedException()
        {
            var dto = TestDataHelper.GetLoginDto();
            dto.Password = "WrongPassword";
            var user = TestDataHelper.GetTestUser();
            _authRepoMock.Setup(r => r.GetByEmailAsync(dto.Email))
                         .ReturnsAsync(user);

            var act = async () => await _authService.LoginAsync(dto);

            await act.Should().ThrowAsync<UnauthorizedAccessException>()
                     .WithMessage("Invalid email or password");
        }
    }
}