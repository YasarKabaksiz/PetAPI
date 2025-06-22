using Microsoft.EntityFrameworkCore;
using PetAPI.Data;
using PetAPI.Dtos;
using PetAPI.Dtos.Pet;
using PetAPI.Entities;
using PetAPI.Interfaces;
using PetAPI.Services;

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

        public async Task<PetDto?> GetPetByUserIdAsync(int userId)
        {
            var pet = await _context.Pets
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.UserId == userId);
            if (pet == null) return null;
            return new PetDto
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
        }

        public async Task<PetDto?> FeedPetAsync(int userId)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (pet == null || user == null)
                return null;

            pet.Hunger = Math.Min(100, pet.Hunger + 10);
            pet.Experience += 5;
            user.Coins += 1;

            int xpForNextLevel = LevelingHelper.GetXpForNextLevel(pet.Level);
            if (pet.Experience >= xpForNextLevel)
            {
                pet.Level += 1;
                pet.Experience -= xpForNextLevel;
                Console.WriteLine($"Pet {pet.Name} seviye atladı! Yeni seviye: {pet.Level}");
            }

            await _context.SaveChangesAsync();
            return new PetDto
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
        }

        public async Task<PetDto?> PlayWithPetAsync(int userId)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (pet == null || user == null)
                return null;

            pet.Happiness = Math.Min(100, pet.Happiness + 15);
            pet.Experience += 10;
            user.Coins += 2;

            int xpForNextLevel = LevelingHelper.GetXpForNextLevel(pet.Level);
            if (pet.Experience >= xpForNextLevel)
            {
                pet.Level += 1;
                pet.Experience -= xpForNextLevel;
                Console.WriteLine($"Pet {pet.Name} seviye atladı! Yeni seviye: {pet.Level}");
            }

            await _context.SaveChangesAsync();
            return new PetDto
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
        }

        public async Task<IEnumerable<Pet>> GetLeaderboardAsync(PaginationParams paginationParams)
        {
            return await _context.Pets
                .AsNoTracking()
                .OrderByDescending(p => p.Happiness)
                .ThenByDescending(p => p.Health)
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync();
        }
    }
}