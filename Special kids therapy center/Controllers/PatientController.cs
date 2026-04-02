using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.Patient;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET api/patient
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor,Receptionist")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _patientService.GetAllAsync();
            return Ok(result);
        }

        // GET api/patient/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor,Receptionist,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _patientService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/patient
        [HttpPost]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Create([FromBody] PatientCreateDto dto)
        {
            var result = await _patientService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.PatientId }, result);
        }

        // PUT api/patient/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Update(int id, [FromBody] PatientUpdateDto dto)
        {
            var result = await _patientService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/patient/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _patientService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
