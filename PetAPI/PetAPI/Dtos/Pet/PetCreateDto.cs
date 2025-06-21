using System.ComponentModel.DataAnnotations;

namespace PetAPI.Dtos.Pet
{
    public class PetCreateDto
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string Type { get; set; } = string.Empty;
    }
} 