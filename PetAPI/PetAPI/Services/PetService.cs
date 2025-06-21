using PetAPI.Data;
using PetAPI.Dtos.Pet;
using PetAPI.Entities;
using PetAPI.Interfaces;

namespace PetAPI.Services
{
    public class PetService : IPetService
    {
        private readonly ApplicationDbContext _context;
        public PetService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Pet> CreatePetAsync(PetCreateDto petDto, int userId)
        {
            var pet = new Pet
            {
                Name = petDto.Name,
                Type = petDto.Type,
                UserId = userId
            };
            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();
            return pet;
        }
    }
} 