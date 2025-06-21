using PetAPI.Data;
using PetAPI.Dtos.Pet;
using PetAPI.Entities;
using PetAPI.Interfaces;
using Microsoft.EntityFrameworkCore;

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

        public async Task<Pet?> GetPetByUserIdAsync(int userId)
        {
            return await _context.Pets
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<Pet?> FeedPetAsync(int userId)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            
            if (pet == null)
                return null;

            pet.Hunger = Math.Min(100, pet.Hunger + 10);
            await _context.SaveChangesAsync();
            
            return pet;
        }

        public async Task<Pet?> PlayWithPetAsync(int userId)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            
            if (pet == null)
                return null;

            pet.Happiness = Math.Min(100, pet.Happiness + 15);
            await _context.SaveChangesAsync();
            
            return pet;
        }
    }
} 