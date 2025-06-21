using System.Threading.Tasks;
using PetAPI.Entities;
using PetAPI.Dtos.Pet;

namespace PetAPI.Interfaces
{
    public interface IPetService
    {
        Task<Pet> CreatePetAsync(PetCreateDto petDto, int userId);
    }
} 