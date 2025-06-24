using PetAPI.Entities;

namespace PetAPI.Interfaces
{
    public interface IStoreService
    {
        Task<IEnumerable<Item>> GetAvailableItemsAsync();
        Task<bool> PurchaseItemAsync(int userId, int itemId);
    }
} 