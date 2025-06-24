using System.ComponentModel.DataAnnotations;

namespace PetAPI.Entities
{
    public class Item
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public int Price { get; set; }
        [Required]
        public string ItemType { get; set; } // Örn: "Food", "Toy", "Cosmetic"
        public int? EffectValue { get; set; } // Yiyecek için +kaç açlık, oyuncak için +kaç mutluluk
        public string ImageUrl { get; set; }
    }
} 