    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Special_kids_therapy_center.DTOs.Appointment;
    using Special_kids_therapy_center.Services.Interface;

    namespace Special_kids_therapy_center.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        [Authorize]
        public class AppointmentController : ControllerBase
        {
            private readonly IAppointmentService _appointmentService;

            public AppointmentController(IAppointmentService appointmentService)
            {
                _appointmentService = appointmentService;
            }

            // GET ALL (Patient + Guardian FIXED)
            [HttpGet]
            [Authorize(Roles = "Admin,Doctor,Receptionist,Patient,Guardian")]
            public async Task<IActionResult> GetAll()
            {
                var result = await _appointmentService.GetAllAsync();
                return Ok(result);
            }

            // GET BY ID
            [HttpGet("{id}")]
            [Authorize(Roles = "Admin,Doctor,Receptionist,Patient,Guardian")]
            public async Task<IActionResult> GetById(int id)
            {
                var result = await _appointmentService.GetByIdAsync(id);
                return Ok(result);
            }

            // CREATE (BOOK APPOINTMENT FIXED)
            [HttpPost]
            [Authorize(Roles = "Admin,Receptionist,Patient,Guardian")]
            public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
            {
                var result = await _appointmentService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.AppointmentId }, result);
            }

            // UPDATE
            [HttpPut("{id}")]
            [Authorize(Roles = "Admin,Receptionist,Doctor")]
            public async Task<IActionResult> Update(int id, [FromBody] AppointmentUpdateDto dto)
            {
                var result = await _appointmentService.UpdateAsync(id, dto);
                return Ok(result);
            }

            // DELETE
            [HttpDelete("{id}")]
            [Authorize(Roles = "Admin")]
            public async Task<IActionResult> Delete(int id)
            {
                var result = await _appointmentService.DeleteAsync(id);
                return Ok(result);
            }
        }
    }