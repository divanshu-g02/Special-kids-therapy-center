using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Special_kids_therapy_center.DTOs.Payment;
using Special_kids_therapy_center.Services.Interface;

namespace Special_kids_therapy_center.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // GET api/payment
        [HttpGet]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _paymentService.GetAllAsync();
            return Ok(result);
        }

        // GET api/payment/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Receptionist,Guardian")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _paymentService.GetByIdAsync(id);
            return Ok(result);
        }

        // POST api/payment
        [HttpPost]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Create([FromBody] PaymentCreateDto dto)
        {
            var result = await _paymentService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.PaymentId }, result);
        }

        // PUT api/payment/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> Update(int id, [FromBody] PaymentUpdateDto dto)
        {
            var result = await _paymentService.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE api/payment/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _paymentService.DeleteAsync(id);
            return Ok(result);
        }
    }
}
