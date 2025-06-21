using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PetAPI.Entities
{
    public class Pet
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Type { get; set; } = string.Empty; // Örn: "Kedi", "Köpek"

        public int Hunger { get; set; } = 100;
        public int Happiness { get; set; } = 100;
        public int Health { get; set; } = 100;

        // Foreign key
        [ForeignKey("User")]
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
} 