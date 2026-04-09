using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class PatientServiceTests
    {
        private readonly Mock<IPatientRepository> _patientRepoMock;
        private readonly PatientService _patientService;

        public PatientServiceTests()
        {
            _patientRepoMock = new Mock<IPatientRepository>();
            _patientService = new PatientService(_patientRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfPatients()
        {
            // Arrange
            var patients = new List<Patient> { TestDataHelper.GetTestPatient() };
            _patientRepoMock.Setup(r => r.GetAllAsync())
                            .Returns(new TestAsyncEnumerable<Patient>(patients));

            // Act
            var result = await _patientService.GetAllAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].FirstName.Should().Be("Omar");
            result[0].LastName.Should().Be("Hassan");
            result[0].Gender.Should().Be(Gender.Male);
            result[0].GuardianId.Should().Be(1);
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsPatient()
        {
            // Arrange
            var patient = TestDataHelper.GetTestPatient();
            _patientRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(patient);

            // Act
            var result = await _patientService.GetByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.PatientId.Should().Be(1);
            result.FirstName.Should().Be("Omar");
            result.LastName.Should().Be("Hassan");
            result.Gender.Should().Be(Gender.Male);
            result.MedicalHistory.Should().Be("Speech delay");
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            // Arrange
            _patientRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Patient?)null);

            // Act
            var act = async () => await _patientService.GetByIdAsync(99);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Patient with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedPatient()
        {
            // Arrange
            var dto = TestDataHelper.GetPatientCreateDto();
            var patient = TestDataHelper.GetTestPatient();
            _patientRepoMock.Setup(r => r.CreateAsync(It.IsAny<Patient>()))
                            .ReturnsAsync(patient);

            // Act
            var result = await _patientService.CreateAsync(dto);

            // Assert
            result.Should().NotBeNull();
            result.FirstName.Should().Be(dto.FirstName);
            result.LastName.Should().Be(dto.LastName);
            result.Gender.Should().Be(dto.Gender);
            result.GuardianId.Should().Be(dto.GuardianId);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedPatient()
        {
            // Arrange
            var dto = TestDataHelper.GetPatientUpdateDto();
            var patient = TestDataHelper.GetTestPatient();
            _patientRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(patient);
            _patientRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Patient>()))
                            .ReturnsAsync(patient);

            // Act
            var result = await _patientService.UpdateAsync(1, dto);

            // Assert
            result.Should().NotBeNull();
            result.PatientId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            // Arrange
            var dto = TestDataHelper.GetPatientUpdateDto();
            _patientRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Patient?)null);

            // Act
            var act = async () => await _patientService.UpdateAsync(99, dto);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Patient with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            // Arrange
            var patient = TestDataHelper.GetTestPatient();
            _patientRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(patient);
            _patientRepoMock.Setup(r => r.DeleteAsync(1))
                            .ReturnsAsync(true);

            // Act
            var result = await _patientService.DeleteAsync(1);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            // Arrange
            _patientRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Patient?)null);

            // Act
            var act = async () => await _patientService.DeleteAsync(99);

            // Assert
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Patient with ID 99 not found");
        }
    }
}