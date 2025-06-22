using System.ComponentModel.DataAnnotations;

namespace PetAPI.Dtos.Pet
{
    /// <summary>
    /// Evcil hayvan oluşturma işlemi için kullanılan veri transfer nesnesi
    /// </summary>
    public class PetCreateDto
    {
        /// <summary>
        /// Evcil hayvanın adı
        /// </summary>
        [Required(ErrorMessage = "Evcil hayvan adı zorunludur.")]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Evcil hayvanın türü (örn: "Kedi", "Köpek")
        /// </summary>
        [Required(ErrorMessage = "Evcil hayvan türü zorunludur.")]
        [StringLength(30)]
        public string Type { get; set; } = string.Empty;
    }
}