using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.Slot;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SlotController : ControllerBase
    {
        private readonly ISlotService _slotService;

        public SlotController(ISlotService slotService)
        {
            _slotService = slotService;
        }

        // GET api/slot
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor,Receptionist,Patient,Guardian")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _slotService.GetAllAsync();
            return Ok(result);
        }

        // GET api/slot/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor,Receptionist,Patient,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _slotService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/slot
        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> Create([FromBody] SlotCreateDto dto)
        {
            var result = await _slotService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.SlotId }, result);
        }

        // PUT api/slot/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor,Receptionist")]
        public async Task<IActionResult> Update(int id, [FromBody] SlotUpdateDto dto)
        {
            var result = await _slotService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/slot/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _slotService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
