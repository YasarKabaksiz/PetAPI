using System.ComponentModel.DataAnnotations;

namespace PetAPI.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "User";

        public int Coins { get; set; } = 0;

        // Navigation property: Kullanıcının evcil hayvanları
        public ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}