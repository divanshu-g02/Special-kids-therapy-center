using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.User;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET api/user
        [HttpGet]
        [Authorize(Roles = "Admin")]                    
        public async Task<IActionResult> GetAll()
        {
            var result = await _userService.GetAllAsync();
            return Ok(result);
        }

        // GET api/user/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]                    
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _userService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/user
        [HttpPost]
        [Authorize(Roles = "Admin")]                   
        public async Task<IActionResult> Create([FromBody] UserCreateDto dto)
        {
            var result = await _userService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.UserId }, result);
        }

        // PUT api/user/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]                  
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
        {
            var result = await _userService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/user/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]                    
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
