using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.Controllers;
using Special_kids_therapy_center.Services.Interface;
using Special_kids_therapy_center.Tests.Helpers;

namespace Special_kids_therapy_center.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _controller = new AuthController(_authServiceMock.Object);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var dto = TestDataHelper.GetLoginDto();
            var response = TestDataHelper.GetAuthResponseDto();
            _authServiceMock.Setup(s => s.LoginAsync(dto))
                            .ReturnsAsync(response);

            // Act
            var result = await _controller.Login(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
        }

        [Fact]
        public async Task Register_ValidData_ReturnsOk()
        {
            // Arrange
            var dto = TestDataHelper.GetRegisterDto();
            var response = TestDataHelper.GetAuthResponseDto();
            _authServiceMock.Setup(s => s.RegisterAsync(dto))
                            .ReturnsAsync(response);

            // Act
            var result = await _controller.Register(dto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.StatusCode.Should().Be(200);
        }
    }
}