using Special_kids_therapy_center.Models;
using Special_kids_therapy_center.DTOs.Auth;
using Special_kids_therapy_center.DTOs.User;
using Special_kids_therapy_center.DTOs.Patient;
using Special_kids_therapy_center.DTOs.Doctor;
using Special_kids_therapy_center.DTOs.Therapy;
using Special_kids_therapy_center.DTOs.Appointment;
using Special_kids_therapy_center.DTOs.Payment;
using Special_kids_therapy_center.DTOs.Slot;
using Special_kids_therapy_center.DTOs.DoctorFinding;

namespace Special_kids_therapy_center.Tests.Helpers
{
    public static class TestDataHelper
    {
        // ─── User 
        public static User GetTestUser() => new User
        {
            UserId = 1,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@12345"),
            Role = Roles.Admin,
            PhoneNo = "03001234567",
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        public static UserCreateDto GetUserCreateDto() => new UserCreateDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Password = "Test@12345",
            Role = Roles.Admin,
            PhoneNo = "03001234567"
        };

        public static UserUpdateDto GetUserUpdateDto() => new UserUpdateDto
        {
            FirstName = "John Updated",
            LastName = "Doe Updated",
            PhoneNo = "03009999999",
            IsActive = true
        };

        public static UserResponseDto GetUserResponseDto() => new UserResponseDto
        {
            UserId = 1,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Role = Roles.Admin,
            PhoneNo = "03001234567",
            IsActive = true,
            CreatedAt = DateTime.Now
        };

        // ─── Auth 
        public static LoginDto GetLoginDto() => new LoginDto
        {
            Email = "john@test.com",
            Password = "Test@12345"
        };

        public static RegisterDto GetRegisterDto() => new RegisterDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Password = "Test@12345",
            Role = Roles.Admin,
            PhoneNo = "03001234567"
        };

        public static AuthResponseDto GetAuthResponseDto() => new AuthResponseDto
        {
            Token = "test_jwt_token",
            Email = "john@test.com",
            FullName = "John Doe",
            Role = "Admin",
            ExpiresAt = DateTime.Now.AddDays(1)
        };

        // ─── Patient 
        public static Patient GetTestPatient() => new Patient
        {
            PatientId = 1,
            GuardianId = 1,
            FirstName = "Omar",
            LastName = "Hassan",
            DateOfBirth = new DateOnly(2018, 5, 15),
            Gender = Gender.Male,
            MedicalHistory = "Speech delay",
            CreatedAt = DateTime.Now
        };

        public static PatientCreateDto GetPatientCreateDto() => new PatientCreateDto
        {
            GuardianId = 1,
            FirstName = "Omar",
            LastName = "Hassan",
            DateOfBirth = new DateOnly(2018, 5, 15),
            Gender = Gender.Male,
            MedicalHistory = "Speech delay"
        };

        public static PatientUpdateDto GetPatientUpdateDto() => new PatientUpdateDto
        {
            GuardianId = 1,
            FirstName = "Omar Updated",
            LastName = "Hassan Updated",
            DateOfBirth = new DateOnly(2018, 5, 15),
            Gender = Gender.Male,
            MedicalHistory = "Updated history"
        };

        public static PatientResponseDto GetPatientResponseDto() => new PatientResponseDto
        {
            PatientId = 1,
            GuardianId = 1,
            GuardianName = "John Doe",
            FirstName = "Omar",
            LastName = "Hassan",
            DateOfBirth = new DateOnly(2018, 5, 15),
            Gender = Gender.Male,
            MedicalHistory = "Speech delay",
            CreatedAt = DateTime.Now
        };

        // ─── Doctor 
        public static Doctor GetTestDoctor() => new Doctor
        {
            DoctorId = 1,
            UserId = 1,
            Specialization = "Speech Therapy",
            Bio = "Experienced therapist",
            AvailableDays = "Mon,Wed,Fri",
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(17, 0)
        };

        public static DoctorCreateDto GetDoctorCreateDto() => new DoctorCreateDto
        {
            UserId = 1,
            Specialization = "Speech Therapy",
            Bio = "Experienced therapist",
            AvailableDays = "Mon,Wed,Fri",
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(17, 0)
        };

        public static DoctorUpdateDto GetDoctorUpdateDto() => new DoctorUpdateDto
        {
            Specialization = "Occupational Therapy",
            Bio = "Updated bio",
            AvailableDays = "Tue,Thu",
            StartTime = new TimeOnly(10, 0),
            EndTime = new TimeOnly(18, 0)
        };

        public static DoctorResponseDto GetDoctorResponseDto() => new DoctorResponseDto
        {
            DoctorId = 1,
            UserId = 1,
            FullName = "John Doe",
            Email = "john@test.com",
            Specialization = "Speech Therapy",
            Bio = "Experienced therapist",
            AvailableDays = "Mon,Wed,Fri",
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(17, 0)
        };

        // ─── Therapy 
        public static Therapy GetTestTherapy() => new Therapy
        {
            TherapyId = 1,
            Name = "Speech Therapy",
            Description = "Therapy for speech improvement",
            DurationMinutes = 60,
            Cost = 2500.00m
        };

        public static TherapyCreateDto GetTherapyCreateDto() => new TherapyCreateDto
        {
            Name = "Speech Therapy",
            Description = "Therapy for speech improvement",
            DurationMinutes = 60,
            Cost = 2500.00m
        };

        public static TherapyUpdateDto GetTherapyUpdateDto() => new TherapyUpdateDto
        {
            Name = "Speech Therapy Updated",
            Description = "Updated description",
            DurationMinutes = 45,
            Cost = 3000.00m
        };

        public static TherapyResponseDto GetTherapyResponseDto() => new TherapyResponseDto
        {
            TherapyId = 1,
            Name = "Speech Therapy",
            Description = "Therapy for speech improvement",
            DurationMinutes = 60,
            Cost = 2500.00m
        };

        // ─── Slot 
        public static Slot GetTestSlot() => new Slot
        {
            SlotId = 1,
            DoctorId = 1,
            Date = new DateOnly(2026, 4, 10),
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0),
            IsBooked = false
        };

        public static SlotCreateDto GetSlotCreateDto() => new SlotCreateDto
        {
            DoctorId = 1,
            Date = new DateOnly(2026, 4, 10),
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0)
        };

        public static SlotUpdateDto GetSlotUpdateDto() => new SlotUpdateDto
        {
            Date = new DateOnly(2026, 4, 11),
            StartTime = new TimeOnly(10, 0),
            EndTime = new TimeOnly(11, 0),
            IsBooked = false
        };

        public static SlotResponseDto GetSlotResponseDto() => new SlotResponseDto
        {
            SlotId = 1,
            DoctorId = 1,
            DoctorName = "John Doe",
            Date = new DateOnly(2026, 4, 10),
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0),
            IsBooked = false
        };

        // ─── Appointment 
        public static Appointment GetTestAppointment() => new Appointment
        {
            AppointmentId = 1,
            PatientId = 1,
            DoctorId = 1,
            TherapyId = 1,
            ReceptionistId = 1,
            AppointmentDate = new DateOnly(2026, 4, 10),
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0),
            Status = Status.Scheduled,
            Notes = "First session",
            CreatedAt = DateTime.Now
        };

        public static AppointmentCreateDto GetAppointmentCreateDto() => new AppointmentCreateDto
        {
            PatientId = 1,
            DoctorId = 1,
            TherapyId = 1,
            ReceptionistId = 1,
            AppointmentDate = new DateOnly(2026, 4, 10),
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0),
            Notes = "First session"
        };

        public static AppointmentUpdateDto GetAppointmentUpdateDto() => new AppointmentUpdateDto
        {
            AppointmentDate = new DateOnly(2026, 4, 12),
            StartTime = new TimeOnly(10, 0),
            EndTime = new TimeOnly(11, 0),
            Status = Status.Completed,
            Notes = "Session completed"
        };

        public static AppointmentResponseDto GetAppointmentResponseDto() => new AppointmentResponseDto
        {
            AppointmentId = 1,
            PatientId = 1,
            PatientName = "Omar Hassan",
            DoctorId = 1,
            DoctorName = "John Doe",
            TherapyId = 1,
            TherapyName = "Speech Therapy",
            ReceptionistId = 1,
            ReceptionistName = "Ali Raza",
            AppointmentDate = new DateOnly(2026, 4, 10),
            StartTime = new TimeOnly(9, 0),
            EndTime = new TimeOnly(10, 0),
            Status = Status.Scheduled,
            Notes = "First session",
            CreatedAt = DateTime.Now
        };

        // ─── DoctorFinding 
        public static DoctorFinding GetTestDoctorFinding() => new DoctorFinding
        {
            FindingId = 1,
            AppointmentId = 1,
            Observations = "Good progress",
            Recommendations = "Continue therapy",
            NextSessionDate = new DateOnly(2026, 4, 17),
            CreatedAt = DateTime.Now
        };

        public static DoctorFindingCreateDto GetDoctorFindingCreateDto() => new DoctorFindingCreateDto
        {
            AppointmentId = 1,
            Observations = "Good progress",
            Recommendations = "Continue therapy",
            NextSessionDate = new DateOnly(2026, 4, 17)
        };

        public static DoctorFindingUpdateDto GetDoctorFindingUpdateDto() => new DoctorFindingUpdateDto
        {
            Observations = "Significant improvement",
            Recommendations = "Reduce to once a week",
            NextSessionDate = new DateOnly(2026, 4, 24)
        };

        public static DoctorFindingResponseDto GetDoctorFindingResponseDto() => new DoctorFindingResponseDto
        {
            FindingId = 1,
            AppointmentId = 1,
            PatientName = "Omar Hassan",
            DoctorName = "John Doe",
            Observations = "Good progress",
            Recommendations = "Continue therapy",
            NextSessionDate = new DateOnly(2026, 4, 17),
            CreatedAt = DateTime.Now
        };

        // ─── Payment 
        public static Payment GetTestPayment() => new Payment
        {
            PaymentId = 1,
            AppointmentId = 1,
            Amount = 2500.00m,
            PaymentMethod = PaymentMethod.Cash,
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.Now
        };

        public static PaymentCreateDto GetPaymentCreateDto() => new PaymentCreateDto
        {
            AppointmentId = 1,
            Amount = 2500.00m,
            PaymentMethod = PaymentMethod.Cash,
            TransactionId = null
        };

        public static PaymentUpdateDto GetPaymentUpdateDto() => new PaymentUpdateDto
        {
            PaymentMethod = PaymentMethod.Credit_Card,  
            Status = PaymentStatus.Paid,
            TransactionId = "TXN123456",
            PaidAt = DateTime.Now
        };

        public static PaymentResponseDto GetPaymentResponseDto() => new PaymentResponseDto
        {
            PaymentId = 1,
            AppointmentId = 1,
            PatientName = "Omar Hassan",
            Amount = 2500.00m,
            PaymentMethod = PaymentMethod.Cash,
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.Now
        };
    }
}