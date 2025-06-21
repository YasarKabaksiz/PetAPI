using System.ComponentModel.DataAnnotations;

namespace PetAPI.Dtos
{
    /// <summary>
    /// Sayfalama parametreleri için kullanılan veri transfer nesnesi
    /// </summary>
    public class PaginationParams
    {
        /// <summary>
        /// Sayfa numarası (varsayılan: 1)
        /// </summary>
        [Range(1, int.MaxValue, ErrorMessage = "Sayfa numarası 1'den büyük olmalıdır.")]
        public int PageNumber { get; set; } = 1;

        /// <summary>
        /// Sayfa başına öğe sayısı (varsayılan: 10, maksimum: 50)
        /// </summary>
        [Range(1, 50, ErrorMessage = "Sayfa boyutu 1-50 arasında olmalıdır.")]
        public int PageSize { get; set; } = 10;
    }
} 