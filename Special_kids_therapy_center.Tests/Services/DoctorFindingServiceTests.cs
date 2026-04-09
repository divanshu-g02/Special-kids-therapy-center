using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class DoctorFindingServiceTests
    {
        private readonly Mock<IDoctorFindingRepository> _findingRepoMock;
        private readonly DoctorFindingService _findingService;

        public DoctorFindingServiceTests()
        {
            _findingRepoMock = new Mock<IDoctorFindingRepository>();
            _findingService = new DoctorFindingService(_findingRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfFindings()
        {
            var findings = new List<DoctorFinding> { TestDataHelper.GetTestDoctorFinding() };
            _findingRepoMock.Setup(r => r.GetAllAsync())
                            .Returns(new TestAsyncEnumerable<DoctorFinding>(findings));

            var result = await _findingService.GetAllAsync();

            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].AppointmentId.Should().Be(1);
            result[0].Observations.Should().Be("Good progress");
            result[0].Recommendations.Should().Be("Continue therapy");
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsFinding()
        {
            var finding = TestDataHelper.GetTestDoctorFinding();
            _findingRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(finding);

            var result = await _findingService.GetByIdAsync(1);

            result.Should().NotBeNull();
            result!.FindingId.Should().Be(1);
            result.AppointmentId.Should().Be(1);
            result.Observations.Should().Be("Good progress");
            result.Recommendations.Should().Be("Continue therapy");
            result.NextSessionDate.Should().Be(new DateOnly(2026, 4, 17));
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _findingRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((DoctorFinding?)null);

            var act = async () => await _findingService.GetByIdAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Finding with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedFinding()
        {
            var dto = TestDataHelper.GetDoctorFindingCreateDto();
            var finding = TestDataHelper.GetTestDoctorFinding();
            _findingRepoMock.Setup(r => r.CreateAsync(It.IsAny<DoctorFinding>()))
                            .ReturnsAsync(finding);

            var result = await _findingService.CreateAsync(dto);

            result.Should().NotBeNull();
            result.AppointmentId.Should().Be(dto.AppointmentId);
            result.Observations.Should().Be(dto.Observations);
            result.Recommendations.Should().Be(dto.Recommendations);
            result.NextSessionDate.Should().Be(dto.NextSessionDate);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedFinding()
        {
            var dto = TestDataHelper.GetDoctorFindingUpdateDto();
            var finding = TestDataHelper.GetTestDoctorFinding();
            _findingRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(finding);
            _findingRepoMock.Setup(r => r.UpdateAsync(It.IsAny<DoctorFinding>()))
                            .ReturnsAsync(finding);

            var result = await _findingService.UpdateAsync(1, dto);

            result.Should().NotBeNull();
            result.FindingId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            var dto = TestDataHelper.GetDoctorFindingUpdateDto();
            _findingRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((DoctorFinding?)null);

            var act = async () => await _findingService.UpdateAsync(99, dto);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Finding with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            var finding = TestDataHelper.GetTestDoctorFinding();
            _findingRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(finding);
            _findingRepoMock.Setup(r => r.DeleteAsync(1))
                            .ReturnsAsync(true);

            var result = await _findingService.DeleteAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _findingRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((DoctorFinding?)null);

            var act = async () => await _findingService.DeleteAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Finding with ID 99 not found");
        }
    }
}