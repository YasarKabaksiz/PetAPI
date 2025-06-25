using System.ComponentModel.DataAnnotations;

namespace PetAPI.Dtos.Pet
{
    public class PetNicknameUpdateDto
    {
        [Required]
        [StringLength(30)]
        public string Nickname { get; set; }
    }
} 