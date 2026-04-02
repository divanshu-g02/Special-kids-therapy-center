using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

        // GET api/appointment
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor,Receptionist")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _appointmentService.GetAllAsync();
            return Ok(result);
        }

        // GET api/appointment/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor,Receptionist,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _appointmentService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/appointment
        [HttpPost]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Create([FromBody] AppointmentCreateDto dto)
        {
            var result = await _appointmentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.AppointmentId }, result);
        }

        // PUT api/appointment/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist,Doctor")]
        public async Task<IActionResult> Update(int id, [FromBody] AppointmentUpdateDto dto)
        {
            var result = await _appointmentService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/appointment/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _appointmentService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
