using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.Doctor;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        // GET api/doctor
        [HttpGet]
        [Authorize(Roles = "Admin,Receptionist,Patient,Guardian")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _doctorService.GetAllAsync();
            return Ok(result);
        }

        // GET api/doctor/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Receptionist,Patient,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _doctorService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/doctor
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] DoctorCreateDto dto)
        {
            var result = await _doctorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.DoctorId }, result);
        }

        // PUT api/doctor/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> Update(int id, [FromBody] DoctorUpdateDto dto)
        {
            var result = await _doctorService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/doctor/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _doctorService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
