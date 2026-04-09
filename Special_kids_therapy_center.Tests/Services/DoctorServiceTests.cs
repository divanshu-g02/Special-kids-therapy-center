using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class DoctorServiceTests
    {
        private readonly Mock<IDoctorRepository> _doctorRepoMock;
        private readonly DoctorService _doctorService;

        public DoctorServiceTests()
        {
            _doctorRepoMock = new Mock<IDoctorRepository>();
            _doctorService = new DoctorService(_doctorRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfDoctors()
        {
            var doctors = new List<Doctor> { TestDataHelper.GetTestDoctor() };
            _doctorRepoMock.Setup(r => r.GetAllAsync())
                           .Returns(new TestAsyncEnumerable<Doctor>(doctors));

            var result = await _doctorService.GetAllAsync();

            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].Specialization.Should().Be("Speech Therapy");
            result[0].DoctorId.Should().Be(1);
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsDoctor()
        {
            var doctor = TestDataHelper.GetTestDoctor();
            _doctorRepoMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(doctor);

            var result = await _doctorService.GetByIdAsync(1);

            result.Should().NotBeNull();
            result!.DoctorId.Should().Be(1);
            result.Specialization.Should().Be("Speech Therapy");
            result.Bio.Should().Be("Experienced therapist");
            result.AvailableDays.Should().Be("Mon,Wed,Fri");
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _doctorRepoMock.Setup(r => r.GetByIdAsync(99))
                           .ReturnsAsync((Doctor?)null);

            var act = async () => await _doctorService.GetByIdAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Doctor with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedDoctor()
        {
            var dto = TestDataHelper.GetDoctorCreateDto();
            var doctor = TestDataHelper.GetTestDoctor();
            _doctorRepoMock.Setup(r => r.CreateAsync(It.IsAny<Doctor>()))
                           .ReturnsAsync(doctor);

            var result = await _doctorService.CreateAsync(dto);

            result.Should().NotBeNull();
            result.Specialization.Should().Be(dto.Specialization);
            result.Bio.Should().Be(dto.Bio);
            result.AvailableDays.Should().Be(dto.AvailableDays);
            result.StartTime.Should().Be(dto.StartTime);
            result.EndTime.Should().Be(dto.EndTime);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedDoctor()
        {
            var dto = TestDataHelper.GetDoctorUpdateDto();
            var doctor = TestDataHelper.GetTestDoctor();
            _doctorRepoMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(doctor);
            _doctorRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Doctor>()))
                           .ReturnsAsync(doctor);

            var result = await _doctorService.UpdateAsync(1, dto);

            result.Should().NotBeNull();
            result.DoctorId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            var dto = TestDataHelper.GetDoctorUpdateDto();
            _doctorRepoMock.Setup(r => r.GetByIdAsync(99))
                           .ReturnsAsync((Doctor?)null);

            var act = async () => await _doctorService.UpdateAsync(99, dto);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Doctor with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            var doctor = TestDataHelper.GetTestDoctor();
            _doctorRepoMock.Setup(r => r.GetByIdAsync(1))
                           .ReturnsAsync(doctor);
            _doctorRepoMock.Setup(r => r.DeleteAsync(1))
                           .ReturnsAsync(true);

            var result = await _doctorService.DeleteAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _doctorRepoMock.Setup(r => r.GetByIdAsync(99))
                           .ReturnsAsync((Doctor?)null);

            var act = async () => await _doctorService.DeleteAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Doctor with ID 99 not found");
        }
    }
}