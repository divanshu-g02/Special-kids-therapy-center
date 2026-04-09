using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.Controllers;
using Special_kids_therapy_center.Services.Interface;
using Special_kids_therapy_center.Tests.Helpers;

namespace Special_kids_therapy_center.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _userServiceMock = new Mock<IUserService>();
            _controller = new UserController(_userServiceMock.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkWithUsers()
        {
            var users = new List<Special_kids_therapy_center.DTOs.User.UserResponseDto>
            {
                TestDataHelper.GetUserResponseDto()
            };
            _userServiceMock.Setup(s => s.GetAllAsync())
                            .ReturnsAsync(users);

            var result = await _controller.GetAll();

            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task GetById_ValidId_ReturnsOk()
        {
            var user = TestDataHelper.GetUserResponseDto();
            _userServiceMock.Setup(s => s.GetByIdAsync(1))
                            .ReturnsAsync(user);

            var result = await _controller.GetById(1);

            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task Create_ValidData_ReturnsCreated()
        {
            var dto = TestDataHelper.GetUserCreateDto();
            var response = TestDataHelper.GetUserResponseDto();
            _userServiceMock.Setup(s => s.CreateAsync(dto))
                            .ReturnsAsync(response);

            var result = await _controller.Create(dto);

            result.Should().BeOfType<CreatedAtActionResult>()
                  .Which.StatusCode.Should().Be(201);
        }

        [Fact]
        public async Task Delete_ValidId_ReturnsOk()
        {
            _userServiceMock.Setup(s => s.DeleteAsync(1))
                            .ReturnsAsync(true);

            var result = await _controller.Delete(1);

            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
        }
    }
}