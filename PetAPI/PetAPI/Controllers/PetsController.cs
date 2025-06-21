using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAPI.Dtos.Pet;
using PetAPI.Entities;
using PetAPI.Interfaces;
using System.Security.Claims;

namespace PetAPI.Controllers
{
    /// <summary>
    /// Evcil hayvan işlemleri için controller
    /// </summary>
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

        /// <summary>
        /// Yeni bir evcil hayvan oluşturur
        /// </summary>
        /// <param name="petDto">Evcil hayvan oluşturma bilgileri</param>
        /// <returns>Oluşturulan evcil hayvan bilgileri</returns>
        /// <response code="201">Evcil hayvan başarıyla oluşturuldu</response>
        /// <response code="400">Geçersiz veri</response>
        /// <response code="401">Kimlik doğrulama gerekli</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
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

        /// <summary>
        /// Giriş yapmış kullanıcının evcil hayvanını getirir
        /// </summary>
        /// <returns>Kullanıcının evcil hayvan bilgileri</returns>
        /// <response code="200">Evcil hayvan bilgileri başarıyla getirildi</response>
        /// <response code="401">Kimlik doğrulama gerekli</response>
        /// <response code="404">Kullanıcıya ait evcil hayvan bulunamadı</response>
        [HttpGet("mypet")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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

        /// <summary>
        /// Evcil hayvanı besler ve açlık değerini artırır
        /// </summary>
        /// <returns>Güncellenmiş evcil hayvan bilgileri</returns>
        /// <response code="200">Evcil hayvan başarıyla beslendi</response>
        /// <response code="401">Kimlik doğrulama gerekli</response>
        /// <response code="404">Kullanıcıya ait evcil hayvan bulunamadı</response>
        [HttpPost("feed")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> FeedPet()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.Name);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var pet = await _petService.FeedPetAsync(userId);

            if (pet == null)
            {
                return NotFound("Size ait bir evcil hayvan bulunamadı.");
            }

            return Ok(pet);
        }

        /// <summary>
        /// Evcil hayvanla oyun oynar ve mutluluk değerini artırır
        /// </summary>
        /// <returns>Güncellenmiş evcil hayvan bilgileri</returns>
        /// <response code="200">Evcil hayvanla başarıyla oyun oynandı</response>
        /// <response code="401">Kimlik doğrulama gerekli</response>
        /// <response code="404">Kullanıcıya ait evcil hayvan bulunamadı</response>
        [HttpPost("play")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> PlayWithPet()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.Name);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var pet = await _petService.PlayWithPetAsync(userId);

            if (pet == null)
            {
                return NotFound("Size ait bir evcil hayvan bulunamadı.");
            }

            return Ok(pet);
        }
    }
} 