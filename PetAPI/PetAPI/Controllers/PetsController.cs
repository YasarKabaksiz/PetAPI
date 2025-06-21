using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAPI.Dtos.Pet;
using PetAPI.Entities;
using PetAPI.Interfaces;
using System.Security.Claims;

namespace PetAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PetsController : ControllerBase
    {
        private readonly IPetService _petService;
        public PetsController(IPetService petService)
        {
            _petService = petService;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePet([FromBody] PetCreateDto petDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.Name);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var pet = await _petService.CreatePetAsync(petDto, userId);
            return CreatedAtAction(nameof(CreatePet), new { id = pet.Id }, pet);
        }

        [HttpGet("mypet")]
        public async Task<IActionResult> GetMyPet()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.Name);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var pet = await _petService.GetPetByUserIdAsync(userId);

            if (pet == null)
            {
                return NotFound("Size ait bir evcil hayvan bulunamadı.");
            }

            return Ok(pet);
        }
    }
} 