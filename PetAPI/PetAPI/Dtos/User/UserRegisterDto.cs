using System.ComponentModel.DataAnnotations;

namespace PetAPI.Dtos.User
{
    /// <summary>
    /// Kullanıcı kayıt işlemi için kullanılan veri transfer nesnesi
    /// </summary>
    public class UserRegisterDto
    {
        /// <summary>
        /// Kullanıcının sisteme giriş için kullanacağı benzersiz kullanıcı adı
        /// </summary>
        [Required(ErrorMessage = "Kullanıcı adı zorunludur.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Kullanıcı adı 3-50 karakter arasında olmalıdır.")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Kullanıcının sisteme giriş için kullanacağı parola
        /// </summary>
        [Required(ErrorMessage = "Şifre zorunludur.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public string Password { get; set; } = string.Empty;
    }
} 