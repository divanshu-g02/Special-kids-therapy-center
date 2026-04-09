using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class SlotServiceTests
    {
        private readonly Mock<ISlotRepository> _slotRepoMock;
        private readonly SlotService _slotService;

        public SlotServiceTests()
        {
            _slotRepoMock = new Mock<ISlotRepository>();
            _slotService = new SlotService(_slotRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfSlots()
        {
            
            var slots = new List<Slot> { TestDataHelper.GetTestSlot() };
            _slotRepoMock.Setup(r => r.GetAllAsync())
                         .Returns(new TestAsyncEnumerable<Slot>(slots));

            var result = await _slotService.GetAllAsync();

      
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].DoctorId.Should().Be(1);
            result[0].IsBooked.Should().BeFalse();
            result[0].Date.Should().Be(new DateOnly(2026, 4, 10));
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsSlot()
        {
            
            var slot = TestDataHelper.GetTestSlot();
            _slotRepoMock.Setup(r => r.GetByIdAsync(1))
                         .ReturnsAsync(slot);

            
            var result = await _slotService.GetByIdAsync(1);

            
            result.Should().NotBeNull();
            result!.SlotId.Should().Be(1);
            result.DoctorId.Should().Be(1);
            result.IsBooked.Should().BeFalse();
            result.StartTime.Should().Be(new TimeOnly(9, 0));
            result.EndTime.Should().Be(new TimeOnly(10, 0));
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            
            _slotRepoMock.Setup(r => r.GetByIdAsync(99))
                         .ReturnsAsync((Slot?)null);

            
            var act = async () => await _slotService.GetByIdAsync(99);

          
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Slot with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedSlot()
        {
           
            var dto = TestDataHelper.GetSlotCreateDto();
            var slot = TestDataHelper.GetTestSlot();
            _slotRepoMock.Setup(r => r.CreateAsync(It.IsAny<Slot>()))
                         .ReturnsAsync(slot);

          
            var result = await _slotService.CreateAsync(dto);

           
            result.Should().NotBeNull();
            result.DoctorId.Should().Be(dto.DoctorId);
            result.Date.Should().Be(dto.Date);
            result.StartTime.Should().Be(dto.StartTime);
            result.EndTime.Should().Be(dto.EndTime);
            result.IsBooked.Should().BeFalse();
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedSlot()
        {
            
            var dto = TestDataHelper.GetSlotUpdateDto();
            var slot = TestDataHelper.GetTestSlot();
            _slotRepoMock.Setup(r => r.GetByIdAsync(1))
                         .ReturnsAsync(slot);
            _slotRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Slot>()))
                         .ReturnsAsync(slot);

          
            var result = await _slotService.UpdateAsync(1, dto);

          
            result.Should().NotBeNull();
            result.SlotId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            
            var dto = TestDataHelper.GetSlotUpdateDto();
            _slotRepoMock.Setup(r => r.GetByIdAsync(99))
                         .ReturnsAsync((Slot?)null);

           
            var act = async () => await _slotService.UpdateAsync(99, dto);

            
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Slot with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            
            var slot = TestDataHelper.GetTestSlot();
            _slotRepoMock.Setup(r => r.GetByIdAsync(1))
                         .ReturnsAsync(slot);
            _slotRepoMock.Setup(r => r.DeleteAsync(1))
                         .ReturnsAsync(true);

          
            var result = await _slotService.DeleteAsync(1);

            
            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
          
            _slotRepoMock.Setup(r => r.GetByIdAsync(99))
                         .ReturnsAsync((Slot?)null);

          
            var act = async () => await _slotService.DeleteAsync(99);


            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Slot with ID 99 not found");
        }
    }
}