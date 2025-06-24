using Microsoft.EntityFrameworkCore;
using PetAPI.Entities;

namespace PetAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Pet> Pets { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<UserInventory> UserInventories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity konfigürasyonu
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20).HasDefaultValue("User");

                // Username benzersiz olmalı
                entity.HasIndex(e => e.Username).IsUnique();
            });

            // Pet entity konfigürasyonu ve ilişki
            modelBuilder.Entity<Pet>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Type).IsRequired().HasMaxLength(30);
                entity.Property(e => e.Hunger).HasDefaultValue(100);
                entity.Property(e => e.Happiness).HasDefaultValue(100);
                entity.Property(e => e.Health).HasDefaultValue(100);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Pets)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // UserInventory çoktan çoğa ilişki ve birleşik anahtar
            modelBuilder.Entity<UserInventory>(entity =>
            {
                entity.HasKey(ui => new { ui.UserId, ui.ItemId });
                entity.HasOne(ui => ui.User)
                      .WithMany()
                      .HasForeignKey(ui => ui.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(ui => ui.Item)
                      .WithMany()
                      .HasForeignKey(ui => ui.ItemId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Item seeding (başlangıç eşyaları)
            modelBuilder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "Küçük Mama", Description = "Evcil hayvanın açlığını biraz giderir.", Price = 10, ItemType = "Food", EffectValue = 15, ImageUrl = "/images/items/small-food.png" },
                new Item { Id = 2, Name = "Büyük Mama", Description = "Evcil hayvanın açlığını büyük oranda giderir.", Price = 25, ItemType = "Food", EffectValue = 40, ImageUrl = "/images/items/big-food.png" },
                new Item { Id = 3, Name = "Lezzetli Ödül", Description = "Evcil hayvanın açlığını tamamen giderir.", Price = 50, ItemType = "Food", EffectValue = 100, ImageUrl = "/images/items/tasty-treat.png" },
                new Item { Id = 4, Name = "Top", Description = "Evcil hayvanın mutluluğunu artırır.", Price = 20, ItemType = "Toy", EffectValue = 20, ImageUrl = "/images/items/ball-toy.png" },
                new Item { Id = 5, Name = "Kedi Tırmalama Tahtası", Description = "Evcil hayvanın mutluluğunu büyük oranda artırır.", Price = 45, ItemType = "Toy", EffectValue = 50, ImageUrl = "/images/items/scratching-post.png" },
                new Item { Id = 6, Name = "Peluş Oyuncak", Description = "Evcil hayvanın mutluluğunu tamamen artırır.", Price = 80, ItemType = "Toy", EffectValue = 100, ImageUrl = "/images/items/plush-toy.png" },
                // Dekorasyon eşyaları
                new Item { Id = 7, Name = "Yıldızlı Gece Duvarı", Description = "Geceleri yıldızlarla dolu güzel bir duvar kağıdı.", Price = 100, ItemType = "Decoration", PlacementArea = "Wall", ImageUrl = "/images/items/starry-wall.png" },
                new Item { Id = 8, Name = "Orman Manzarası Duvarı", Description = "Yeşil orman manzarası ile huzurlu bir atmosfer.", Price = 120, ItemType = "Decoration", PlacementArea = "Wall", ImageUrl = "/images/items/forest-wall.png" },
                new Item { Id = 9, Name = "Ahşap Parke", Description = "Doğal ahşap parke zemin.", Price = 80, ItemType = "Decoration", PlacementArea = "Floor", ImageUrl = "/images/items/wooden-floor.png" },
                new Item { Id = 10, Name = "Yumuşak Halı", Description = "Sıcak ve yumuşak halı zemin.", Price = 90, ItemType = "Decoration", PlacementArea = "Floor", ImageUrl = "/images/items/soft-carpet.png" }
            );
        }
    }
}