using System.ComponentModel.DataAnnotations;

namespace PetAPI.Dtos.User
{
    /// <summary>
    /// Kullanıcı giriş işlemi için kullanılan veri transfer nesnesi
    /// </summary>
    public class UserLoginDto
    {
        /// <summary>
        /// Kullanıcının sisteme giriş için kullandığı kullanıcı adı
        /// </summary>
        [Required(ErrorMessage = "Kullanıcı adı zorunludur.")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Kullanıcının sisteme giriş için kullandığı parola
        /// </summary>
        [Required(ErrorMessage = "Şifre zorunludur.")]
        public string Password { get; set; } = string.Empty;
    }
} 