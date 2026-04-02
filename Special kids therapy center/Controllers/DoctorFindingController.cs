using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.DoctorFinding;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorFindingController : ControllerBase
    {
        private readonly IDoctorFindingService _doctorFindingService;

        public DoctorFindingController(IDoctorFindingService doctorFindingService)
        {
            _doctorFindingService = doctorFindingService;
        }

        // GET api/doctorfinding
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _doctorFindingService.GetAllAsync();
            return Ok(result);
        }

        // GET api/doctorfinding/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _doctorFindingService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/doctorfinding
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Create([FromBody] DoctorFindingCreateDto dto)
        {
            var result = await _doctorFindingService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.FindingId }, result);
        }

        // PUT api/doctorfinding/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Update(int id, [FromBody] DoctorFindingUpdateDto dto)
        {
            var result = await _doctorFindingService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/doctorfinding/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _doctorFindingService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
