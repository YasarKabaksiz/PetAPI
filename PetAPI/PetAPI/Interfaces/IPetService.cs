using System.Threading.Tasks;
using PetAPI.Entities;
using PetAPI.Dtos.Pet;
using PetAPI.Dtos;

namespace PetAPI.Interfaces
{
    public interface IPetService
    {
        Task<Pet> CreatePetAsync(PetCreateDto petDto, int userId);
        Task<Pet?> GetPetByUserIdAsync(int userId);
        Task<Pet?> FeedPetAsync(int userId);
        Task<Pet?> PlayWithPetAsync(int userId);
        Task<IEnumerable<Pet>> GetLeaderboardAsync(PaginationParams paginationParams);
    }
} 