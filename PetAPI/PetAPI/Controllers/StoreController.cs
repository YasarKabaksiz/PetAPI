using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetAPI.Interfaces;
using System.Security.Claims;

namespace PetAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _storeService;
        public StoreController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _storeService.GetAvailableItemsAsync();
            return Ok(items);
        }

        [HttpPost("purchase/{itemId}")]
        public async Task<IActionResult> PurchaseItem(int itemId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var result = await _storeService.PurchaseItemAsync(userId, itemId);
            if (!result)
                return BadRequest("Yetersiz bakiye.");
            return Ok();
        }

        [HttpGet("my-inventory")]
        public async Task<IActionResult> GetMyInventory()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var inventory = await _storeService.GetUserInventoryAsync(userId);
            return Ok(inventory);
        }

        [HttpDelete("inventory/{itemId}")]
        public async Task<IActionResult> RemoveItemFromInventory(int itemId)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();
            var result = await _storeService.RemoveItemFromInventoryAsync(userId, itemId);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
} 