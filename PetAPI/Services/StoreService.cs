using Microsoft.EntityFrameworkCore;
using PetAPI.Data;
using PetAPI.Entities;
using PetAPI.Interfaces;

namespace PetAPI.Services
{
    public class StoreService : IStoreService
    {
        private readonly ApplicationDbContext _context;
        public StoreService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> GetAvailableItemsAsync()
        {
            return await _context.Items.AsNoTracking().ToListAsync();
        }

        public async Task<bool> PurchaseItemAsync(int userId, int itemId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var item = await _context.Items.FirstOrDefaultAsync(i => i.Id == itemId);
            if (user == null || item == null) return false;
            if (user.Coins < item.Price) return false;

            user.Coins -= item.Price;

            var inventory = await _context.UserInventories.FirstOrDefaultAsync(ui => ui.UserId == userId && ui.ItemId == itemId);
            if (inventory != null)
            {
                inventory.Quantity += 1;
            }
            else
            {
                _context.UserInventories.Add(new UserInventory
                {
                    UserId = userId,
                    ItemId = itemId,
                    Quantity = 1
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<object>> GetUserInventoryAsync(int userId)
        {
            var inventory = await _context.UserInventories
                .Include(ui => ui.Item)
                .Where(ui => ui.UserId == userId)
                .ToListAsync();
            return inventory.Select(ui => new { item = ui.Item, quantity = ui.Quantity });
        }
    }
} 