using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class PaymentServiceTests
    {
        private readonly Mock<IPaymentRepository> _paymentRepoMock;
        private readonly PaymentService _paymentService;

        public PaymentServiceTests()
        {
            _paymentRepoMock = new Mock<IPaymentRepository>();
            _paymentService = new PaymentService(_paymentRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfPayments()
        {
            var payments = new List<Payment> { TestDataHelper.GetTestPayment() };
            _paymentRepoMock.Setup(r => r.GetAllAsync())
                            .Returns(new TestAsyncEnumerable<Payment>(payments));

            var result = await _paymentService.GetAllAsync();

            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].Amount.Should().Be(2500.00m);
            result[0].Status.Should().Be(PaymentStatus.Pending);
            result[0].PaymentMethod.Should().Be(PaymentMethod.Cash);
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsPayment()
        {
            var payment = TestDataHelper.GetTestPayment();
            _paymentRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(payment);

            var result = await _paymentService.GetByIdAsync(1);

            result.Should().NotBeNull();
            result!.PaymentId.Should().Be(1);
            result.AppointmentId.Should().Be(1);
            result.Amount.Should().Be(2500.00m);
            result.Status.Should().Be(PaymentStatus.Pending);
            result.PaymentMethod.Should().Be(PaymentMethod.Cash);
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _paymentRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Payment?)null);

            var act = async () => await _paymentService.GetByIdAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Payment with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedPayment()
        {
            var dto = TestDataHelper.GetPaymentCreateDto();
            var payment = TestDataHelper.GetTestPayment();
            _paymentRepoMock.Setup(r => r.CreateAsync(It.IsAny<Payment>()))
                            .ReturnsAsync(payment);

            var result = await _paymentService.CreateAsync(dto);

            result.Should().NotBeNull();
            result.AppointmentId.Should().Be(dto.AppointmentId);
            result.Amount.Should().Be(dto.Amount);
            result.PaymentMethod.Should().Be(dto.PaymentMethod);
            result.Status.Should().Be(PaymentStatus.Pending);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedPayment()
        {
            var dto = TestDataHelper.GetPaymentUpdateDto();
            var payment = TestDataHelper.GetTestPayment();
            _paymentRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(payment);
            _paymentRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Payment>()))
                            .ReturnsAsync(payment);

            var result = await _paymentService.UpdateAsync(1, dto);

            result.Should().NotBeNull();
            result.PaymentId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            var dto = TestDataHelper.GetPaymentUpdateDto();
            _paymentRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Payment?)null);

            var act = async () => await _paymentService.UpdateAsync(99, dto);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Payment with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            var payment = TestDataHelper.GetTestPayment();
            _paymentRepoMock.Setup(r => r.GetByIdAsync(1))
                            .ReturnsAsync(payment);
            _paymentRepoMock.Setup(r => r.DeleteAsync(1))
                            .ReturnsAsync(true);

            var result = await _paymentService.DeleteAsync(1);

            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            _paymentRepoMock.Setup(r => r.GetByIdAsync(99))
                            .ReturnsAsync((Payment?)null);

            var act = async () => await _paymentService.DeleteAsync(99);

            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Payment with ID 99 not found");
        }
    }
}