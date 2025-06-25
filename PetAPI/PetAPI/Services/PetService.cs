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
            // Kullanıcının mevcut pet'i var mı?
            var existingPet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            if (existingPet != null)
            {
                if (existingPet.Health == 0)
                {
                    // Revive: Statüleri sıfırla, isim ve türü güncelle
                    existingPet.Name = petDto.Name;
                    existingPet.Type = petDto.Type;
                    existingPet.Level = 1;
                    existingPet.Experience = 0;
                    existingPet.Hunger = 100;
                    existingPet.Happiness = 100;
                    existingPet.Health = 100;
                    await _context.SaveChangesAsync();
                    return existingPet;
                }
                // Eğer pet zaten hayattaysa, yeni pet oluşturulmaz (isteğe göre hata fırlatılabilir)
                return existingPet;
            }
            // Hiç pet yoksa yeni oluştur
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
                Health = pet.Health,
                Nickname = pet.Nickname
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
                Health = pet.Health,
                Nickname = pet.Nickname
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
                Health = pet.Health,
                Nickname = pet.Nickname
            };
        }

        public async Task<IEnumerable<Pet>> GetLeaderboardAsync(PaginationParams paginationParams)
        {
            return await _context.Pets
                .AsNoTracking()
                .OrderByDescending(p => p.Level)
                .ThenByDescending(p => p.Happiness)
                .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
                .Take(paginationParams.PageSize)
                .ToListAsync();
        }

        public async Task<Pet> SubmitMinigameResultAsync(int userId, SubmitMinigameResultDto resultDto)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (pet == null || user == null) return null!;

            switch (resultDto.GameType.ToLower())
            {
                case "feed":
                    pet.Hunger = Math.Min(100, pet.Hunger + resultDto.Score);
                    pet.Experience += (int)Math.Round(resultDto.Score * 0.5);
                    user.Coins += (int)Math.Round(resultDto.Score * 0.1);
                    break;
                case "play":
                    pet.Happiness = Math.Min(100, pet.Happiness + resultDto.Score);
                    pet.Experience += (int)Math.Round(resultDto.Score * 0.75);
                    user.Coins += (int)Math.Round(resultDto.Score * 0.2);
                    break;
                default:
                    break;
            }

            // Seviye atlama kontrolü
            int xpForNextLevel = LevelingHelper.GetXpForNextLevel(pet.Level);
            while (pet.Experience >= xpForNextLevel)
            {
                pet.Level += 1;
                pet.Experience -= xpForNextLevel;
                xpForNextLevel = LevelingHelper.GetXpForNextLevel(pet.Level);
            }

            await _context.SaveChangesAsync();
            return pet;
        }

        public async Task<Pet?> UseItemOnPetAsync(int userId, int itemId)
        {
            var user = await _context.Users.Include(u => u.Pets).FirstOrDefaultAsync(u => u.Id == userId);
            var pet = user?.Pets.FirstOrDefault();
            if (pet == null || pet.Health <= 0)
            {
                throw new InvalidOperationException("Bu işlemi yapacak aktif bir evcil hayvanınız yok.");
            }

            var inventory = await _context.UserInventories.Include(ui => ui.Item).FirstOrDefaultAsync(ui => ui.UserId == userId && ui.ItemId == itemId);
            if (inventory == null || inventory.Quantity <= 0)
            {
                throw new KeyNotFoundException("Bu eşyaya envanterinizde sahip değilsiniz veya tükendi.");
            }

            var item = inventory.Item;
            if (item == null)
            {
                throw new KeyNotFoundException("Eşya bulunamadı.");
            }

            int xpGain = 0;
            switch (item.ItemType)
            {
                case "Food":
                    pet.Hunger = Math.Min(100, pet.Hunger + (item.EffectValue ?? 0));
                    xpGain = (item.EffectValue ?? 0) / 2;
                    break;
                case "Toy":
                    pet.Happiness = Math.Min(100, pet.Happiness + (item.EffectValue ?? 0));
                    xpGain = (item.EffectValue ?? 0) / 2;
                    break;
                default:
                    throw new NotSupportedException($"Bu eşya tipi desteklenmiyor: {item.ItemType}");
            }

            inventory.Quantity -= 1;
            pet.Experience += xpGain;

            // Seviye atlama kontrolü
            int xpForNextLevel = LevelingHelper.GetXpForNextLevel(pet.Level);
            while (pet.Experience >= xpForNextLevel)
            {
                pet.Level += 1;
                pet.Experience -= xpForNextLevel;
                xpForNextLevel = LevelingHelper.GetXpForNextLevel(pet.Level);
            }

            await _context.SaveChangesAsync();
            return pet;
        }

        public async Task<Pet?> UpdatePetAsync(int userId, PetUpdateDto petUpdateDto)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            if (pet == null)
                return null;
            pet.Name = petUpdateDto.Name;
            pet.Type = petUpdateDto.Type;
            await _context.SaveChangesAsync();
            return pet;
        }

        public async Task<Pet?> UpdatePetNicknameAsync(int userId, string nickname)
        {
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.UserId == userId);
            if (pet == null)
                return null;
            pet.Nickname = nickname;
            await _context.SaveChangesAsync();
            return pet;
        }
    }
}