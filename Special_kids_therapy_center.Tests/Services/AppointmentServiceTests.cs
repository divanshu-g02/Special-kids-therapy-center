using Moq;
using FluentAssertions;
using Special_kids_therapy_center.Services.Implementation;
using Special_kids_therapy_center.Repository.Interface;
using Special_kids_therapy_center.Tests.Helpers;
using Special_kids_therapy_center.Models;

namespace Special_kids_therapy_center.Tests.Services
{
    public class AppointmentServiceTests
    {
        private readonly Mock<IAppointmentRepository> _appointmentRepoMock;
        private readonly AppointmentService _appointmentService;

        public AppointmentServiceTests()
        {
            _appointmentRepoMock = new Mock<IAppointmentRepository>();
            _appointmentService = new AppointmentService(_appointmentRepoMock.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsListOfAppointments()
        {
        
            var appointments = new List<Appointment> { TestDataHelper.GetTestAppointment() };
            _appointmentRepoMock.Setup(r => r.GetAllAsync())
                                .Returns(new TestAsyncEnumerable<Appointment>(appointments));


            var result = await _appointmentService.GetAllAsync();

      
            result.Should().NotBeNull();
            result.Should().HaveCount(1);
            result[0].PatientId.Should().Be(1);
            result[0].DoctorId.Should().Be(1);
            result[0].Status.Should().Be(Status.Scheduled);
        }

        [Fact]
        public async Task GetByIdAsync_ValidId_ReturnsAppointment()
        {
       
            var appointment = TestDataHelper.GetTestAppointment();
            _appointmentRepoMock.Setup(r => r.GetByIdAsync(1))
                                .ReturnsAsync(appointment);

            var result = await _appointmentService.GetByIdAsync(1);


            result.Should().NotBeNull();
            result!.AppointmentId.Should().Be(1);
            result.PatientId.Should().Be(1);
            result.DoctorId.Should().Be(1);
            result.TherapyId.Should().Be(1);
            result.Status.Should().Be(Status.Scheduled);
            result.Notes.Should().Be("First session");
        }

        [Fact]
        public async Task GetByIdAsync_InvalidId_ThrowsKeyNotFoundException()
        {
          
            _appointmentRepoMock.Setup(r => r.GetByIdAsync(99))
                                .ReturnsAsync((Appointment?)null);

          
            var act = async () => await _appointmentService.GetByIdAsync(99);

            
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Appointment with ID 99 not found");
        }

        [Fact]
        public async Task CreateAsync_ValidData_ReturnsCreatedAppointment()
        {
            
            var dto = TestDataHelper.GetAppointmentCreateDto();
            var appointment = TestDataHelper.GetTestAppointment();
            _appointmentRepoMock.Setup(r => r.CreateAsync(It.IsAny<Appointment>()))
                                .ReturnsAsync(appointment);

           
            var result = await _appointmentService.CreateAsync(dto);

         
            result.Should().NotBeNull();
            result.PatientId.Should().Be(dto.PatientId);
            result.DoctorId.Should().Be(dto.DoctorId);
            result.TherapyId.Should().Be(dto.TherapyId);
            result.ReceptionistId.Should().Be(dto.ReceptionistId);
            result.Status.Should().Be(Status.Scheduled);
            result.Notes.Should().Be(dto.Notes);
        }

        [Fact]
        public async Task UpdateAsync_ValidId_ReturnsUpdatedAppointment()
        {
          
            var dto = TestDataHelper.GetAppointmentUpdateDto();
            var appointment = TestDataHelper.GetTestAppointment();
            _appointmentRepoMock.Setup(r => r.GetByIdAsync(1))
                                .ReturnsAsync(appointment);
            _appointmentRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Appointment>()))
                                .ReturnsAsync(appointment);

            
            var result = await _appointmentService.UpdateAsync(1, dto);

           
            result.Should().NotBeNull();
            result.AppointmentId.Should().Be(1);
        }

        [Fact]
        public async Task UpdateAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            
            var dto = TestDataHelper.GetAppointmentUpdateDto();
            _appointmentRepoMock.Setup(r => r.GetByIdAsync(99))
                                .ReturnsAsync((Appointment?)null);

           
            var act = async () => await _appointmentService.UpdateAsync(99, dto);

           
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Appointment with ID 99 not found");
        }

        [Fact]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
        
            var appointment = TestDataHelper.GetTestAppointment();
            _appointmentRepoMock.Setup(r => r.GetByIdAsync(1))
                                .ReturnsAsync(appointment);
            _appointmentRepoMock.Setup(r => r.DeleteAsync(1))
                                .ReturnsAsync(true);

        
            var result = await _appointmentService.DeleteAsync(1);

            
            result.Should().BeTrue();
        }

        [Fact]
        public async Task DeleteAsync_InvalidId_ThrowsKeyNotFoundException()
        {
            
            _appointmentRepoMock.Setup(r => r.GetByIdAsync(99))
                                .ReturnsAsync((Appointment?)null);

           
            var act = async () => await _appointmentService.DeleteAsync(99);

          
            await act.Should().ThrowAsync<KeyNotFoundException>()
                     .WithMessage("Appointment with ID 99 not found");
        }
    }
}