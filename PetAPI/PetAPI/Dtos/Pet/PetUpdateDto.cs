using System.ComponentModel.DataAnnotations;
using PetAPI.Validation;

namespace PetAPI.Dtos.Pet
{
    public class PetUpdateDto
    {
        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        [Required]
        [AllowedPetTypes]
        public string Type { get; set; }
    }
} 