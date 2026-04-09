using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class TherapyServiceTests
    {
        private readonly Mock<ITherapyRepository> _therapyRepoMock;
        private readonly TherapyService _therapyService;

        public TherapyServiceTests()
        {
            _therapyRepoMock = new Mock<ITherapyRepository>();
            _therapyService = new TherapyService(_therapyRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfTherapies()
        {
            
            var therapies = new List<Therapy> { TestDataHelper.GetTestTherapy() };
            _therapyRepoMock.Setup(r => r.GetAllAsync())
                            .Returns(new TestAsyncEnumerable<Therapy>(therapies));

            
            var result = await _therapyService.GetAllAsync();

           
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].Name.Should().Be("Speech Therapy");
            result[0].DurationMinutes.Should().Be(60);
            result[0].Cost.Should().Be(2500.00m);
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsTherapy()
        {
        
            var therapy = TestDataHelper.GetTestTherapy();
            _therapyRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(therapy);

            
            var result = await _therapyService.GetByIdAsync(1);

            
            result.Should().NotBeNull();
            result!.TherapyId.Should().Be(1);
            result.Name.Should().Be("Speech Therapy");
            result.Description.Should().Be("Therapy for speech improvement");
            result.DurationMinutes.Should().Be(60);
            result.Cost.Should().Be(2500.00m);
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
           
            _therapyRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Therapy?)null);

          
            var act = async () => await _therapyService.GetByIdAsync(99);

        
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Therapy with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedTherapy()
        {

            var dto = TestDataHelper.GetTherapyCreateDto();
            var therapy = TestDataHelper.GetTestTherapy();
            _therapyRepoMock.Setup(r => r.CreateAsync(It.IsAny<Therapy>()))
                            .ReturnsAsync(therapy);

           
            var result = await _therapyService.CreateAsync(dto);

     
            result.Should().NotBeNull();
            result.Name.Should().Be(dto.Name);
            result.Description.Should().Be(dto.Description);
            result.DurationMinutes.Should().Be(dto.DurationMinutes);
            result.Cost.Should().Be(dto.Cost);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedTherapy()
        {
          
            var dto = TestDataHelper.GetTherapyUpdateDto();
            var therapy = TestDataHelper.GetTestTherapy();
            _therapyRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(therapy);
            _therapyRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Therapy>()))
                            .ReturnsAsync(therapy);

         
            var result = await _therapyService.UpdateAsync(1, dto);

          
            result.Should().NotBeNull();
            result.TherapyId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
           
            var dto = TestDataHelper.GetTherapyUpdateDto();
            _therapyRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Therapy?)null);

            
            var act = async () => await _therapyService.UpdateAsync(99, dto);

    
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Therapy with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
        
            var therapy = TestDataHelper.GetTestTherapy();
            _therapyRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(therapy);
            _therapyRepoMock.Setup(r => r.DeleteAsync(1))
                            .ReturnsAsync(true);

   
            var result = await _therapyService.DeleteAsync(1);

           
            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            
            _therapyRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Therapy?)null);

          
            var act = async () => await _therapyService.DeleteAsync(99);

        
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Therapy with ID 99 not found");
        }
    }
}