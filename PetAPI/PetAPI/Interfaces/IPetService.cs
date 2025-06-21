using System.Threading.Tasks;
using PetAPI.Entities;
using PetAPI.Dtos.Pet;

namespace PetAPI.Interfaces
{
    public interface IPetService
    {
        Task<Pet> CreatePetAsync(PetCreateDto petDto, int userId);
        Task<Pet?> GetPetByUserIdAsync(int userId);
        Task<Pet?> FeedPetAsync(int userId);
        Task<Pet?> PlayWithPetAsync(int userId);
    }
} 