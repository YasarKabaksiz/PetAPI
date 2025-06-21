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
        }
    }
} 