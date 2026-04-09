using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepoMock;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _userRepoMock = new Mock<IUserRepository>();
            _userService = new UserService(_userRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfUsers()
        {
            var users = new List<User> { TestDataHelper.GetTestUser() };
            _userRepoMock.Setup(r => r.GetAllAsync())
                         .Returns(new TestAsyncEnumerable<User>(users)); 

            var result = await _userService.GetAllAsync();

            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].Email.Should().Be("john@test.com");
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsUser()
        {
            var user = TestDataHelper.GetTestUser();
            _userRepoMock.Setup(r => r.GetByIdAsync(1))
                         .ReturnsAsync(user);

            var result = await _userService.GetByIdAsync(1);

            result.Should().NotBeNull();
            result!.UserId.Should().Be(1);
            result.Email.Should().Be("john@test.com");
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _userRepoMock.Setup(r => r.GetByIdAsync(99))
                         .ReturnsAsync((User?)null);

            var act = async () => await _userService.GetByIdAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("User with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedUser()
        {
            var dto = TestDataHelper.GetUserCreateDto();
            var user = TestDataHelper.GetTestUser();
            _userRepoMock.Setup(r => r.CreateAsync(It.IsAny<User>()))
                         .ReturnsAsync(user);

            var result = await _userService.CreateAsync(dto);

            result.Should().NotBeNull();
            result.Email.Should().Be(dto.Email);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedUser()
        {
            var dto = TestDataHelper.GetUserUpdateDto();
            var user = TestDataHelper.GetTestUser();
            _userRepoMock.Setup(r => r.GetByIdAsync(1))
                         .ReturnsAsync(user);
            _userRepoMock.Setup(r => r.UpdateAsync(It.IsAny<User>()))
                         .ReturnsAsync(user);

            var result = await _userService.UpdateAsync(1, dto);

            result.Should().NotBeNull();
            result.UserId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            var dto = TestDataHelper.GetUserUpdateDto();
            _userRepoMock.Setup(r => r.GetByIdAsync(99))
                         .ReturnsAsync((User?)null);

            var act = async () => await _userService.UpdateAsync(99, dto);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("User with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            var user = TestDataHelper.GetTestUser();
            _userRepoMock.Setup(r => r.GetByIdAsync(1))
                         .ReturnsAsync(user);
            _userRepoMock.Setup(r => r.DeleteAsync(1))
                         .ReturnsAsync(true);

            var result = await _userService.DeleteAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _userRepoMock.Setup(r => r.GetByIdAsync(99))
                         .ReturnsAsync((User?)null);

            var act = async () => await _userService.DeleteAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("User with ID 99 not found");
        }
    }
}