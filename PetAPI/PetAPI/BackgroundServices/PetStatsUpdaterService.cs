using Microsoft.EntityFrameworkCore;
using PetAPI.Data;

namespace PetAPI.BackgroundServices
{
    public class PetStatsUpdaterService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PetStatsUpdaterService> _logger;

        public PetStatsUpdaterService(IServiceProvider serviceProvider, ILogger<PetStatsUpdaterService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Pet Stats Updater Service başlatıldı.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Her 10 saniyede bir çalış (test için, production'da 60 saniye yapılabilir)
                    await Task.Delay(TimeSpan.FromSeconds(45), stoppingToken);

                    using var scope = _serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    // Tüm pet'leri çek
                    var pets = await context.Pets.ToListAsync(stoppingToken);

                    if (pets.Any())
                    {
                        var updatedCount = 0;

                        foreach (var pet in pets)
                        {
                            // Hunger ve Happiness değerlerini 1 azalt, ancak 0'ın altına düşürme
                            pet.Hunger = Math.Max(0, pet.Hunger - 1);
                            pet.Happiness = Math.Max(0, pet.Happiness - 1);
                            updatedCount++;
                        }

                        // Değişiklikleri veritabanına kaydet
                        await context.SaveChangesAsync(stoppingToken);

                        _logger.LogInformation("{UpdatedCount} evcil hayvanın istatistikleri güncellendi.", updatedCount);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Pet istatistikleri güncellenirken hata oluştu.");
                }
            }

            _logger.LogInformation("Pet Stats Updater Service durduruldu.");
        }
    }
}