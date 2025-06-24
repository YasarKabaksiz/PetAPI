using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAPI.Dtos;
using PetAPI.Dtos.Pet;
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
            var petDtoResult = new PetDto
            {
                Id = pet.Id,
                Name = pet.Name,
                Type = pet.Type,
                Level = pet.Level,
                Experience = pet.Experience,
                Hunger = pet.Hunger,
                Happiness = pet.Happiness,
                Health = pet.Health
            };
            return CreatedAtAction(nameof(CreatePet), new { id = pet.Id }, petDtoResult);
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
        public async Task<ActionResult<PetDto>> GetMyPet()
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
        /// Mini oyun sonucunu işler
        /// </summary>
        /// <param name="resultDto">Mini oyun sonucu</param>
        /// <returns>Güncellenmiş evcil hayvan bilgileri</returns>
        [HttpPost("submit-minigame")]
        public async Task<ActionResult<PetDto>> SubmitMinigameResult([FromBody] SubmitMinigameResultDto resultDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.Name);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized("Kullanıcı kimliği bulunamadı.");

            var pet = await _petService.SubmitMinigameResultAsync(userId, resultDto);
            if (pet == null)
                return NotFound("Size ait bir evcil hayvan bulunamadı.");

            var petDtoResult = new PetDto
            {
                Id = pet.Id,
                Name = pet.Name,
                Type = pet.Type,
                Level = pet.Level,
                Experience = pet.Experience,
                Hunger = pet.Hunger,
                Happiness = pet.Happiness,
                Health = pet.Health
            };
            return Ok(petDtoResult);
        }

        /// <summary>
        /// Evcil hayvanların liderlik tablosunu getirir (kimlik doğrulama gerekmez)
        /// </summary>
        /// <param name="paginationParams">Sayfalama parametreleri</param>
        /// <returns>Mutluluk ve sağlık değerlerine göre sıralanmış evcil hayvan listesi</returns>
        /// <response code="200">Liderlik tablosu başarıyla getirildi</response>
        /// <response code="400">Geçersiz sayfalama parametreleri</response>
        [HttpGet("leaderboard")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetLeaderboard([FromQuery] PaginationParams paginationParams)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var pets = await _petService.GetLeaderboardAsync(paginationParams);
            return Ok(pets);
        }

        [HttpPost("use-item/{itemId}")]
        public async Task<IActionResult> UseItemOnPet(int itemId)
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier) ?? User.FindFirst(System.Security.Claims.ClaimTypes.Name);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                    return Unauthorized("Kullanıcı kimliği bulunamadı.");

                var pet = await _petService.UseItemOnPetAsync(userId, itemId);
                var petDto = new PetAPI.Dtos.Pet.PetDto
                {
                    Id = pet.Id,
                    Name = pet.Name,
                    Type = pet.Type,
                    Level = pet.Level,
                    Experience = pet.Experience,
                    Hunger = pet.Hunger,
                    Happiness = pet.Happiness,
                    Health = pet.Health
                };
                return Ok(petDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (NotSupportedException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin." });
            }
        }
    }
}