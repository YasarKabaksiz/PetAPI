using PetAPI.Dtos;
using PetAPI.Dtos.Pet;
using PetAPI.Entities;

namespace PetAPI.Interfaces
{
    public interface IPetService
    {
        Task<Pet> CreatePetAsync(PetCreateDto petDto, int userId);
        Task<PetDto?> GetPetByUserIdAsync(int userId);
        Task<PetDto?> FeedPetAsync(int userId);
        Task<PetDto?> PlayWithPetAsync(int userId);
        Task<IEnumerable<Pet>> GetLeaderboardAsync(PaginationParams paginationParams);
        Task<Pet> SubmitMinigameResultAsync(int userId, SubmitMinigameResultDto resultDto);
        Task<Pet?> UseItemOnPetAsync(int userId, int itemId);
        Task<Pet?> UpdatePetAsync(int userId, PetUpdateDto petUpdateDto);
    }
}