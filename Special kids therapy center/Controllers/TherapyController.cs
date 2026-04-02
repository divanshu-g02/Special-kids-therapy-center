using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.Therapy;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TherapyController : ControllerBase
    {
        private readonly ITherapyService _therapyService;

        public TherapyController(ITherapyService therapyService)
        {
            _therapyService = therapyService;
        }

        // GET api/therapy
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor,Receptionist,Patient,Guardian")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _therapyService.GetAllAsync();
            return Ok(result);
        }

        // GET api/therapy/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor,Receptionist,Patient,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _therapyService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/therapy
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] TherapyCreateDto dto)
        {
            var result = await _therapyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.TherapyId }, result);
        }

        // PUT api/therapy/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] TherapyUpdateDto dto)
        {
            var result = await _therapyService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/therapy/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _therapyService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
