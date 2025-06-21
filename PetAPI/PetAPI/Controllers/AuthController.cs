using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetAPI.Data;
using PetAPI.Dtos.User;
using PetAPI.Entities;
using BCrypt.Net;

namespace PetAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Yeni kullanıcı kaydı oluşturur
        /// </summary>
        /// <param name="registerDto">Kullanıcı kayıt bilgileri</param>
        /// <returns>Kayıt işlemi sonucu</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            try
            {
                // Kullanıcı adının zaten kullanılıp kullanılmadığını kontrol et
                var existingUser = await _context.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Username == registerDto.Username);

                if (existingUser != null)
                {
                    return BadRequest("Bu kullanıcı adı zaten alınmış.");
                }

                // Şifreyi güvenli bir şekilde hash'le
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                // Yeni kullanıcı nesnesi oluştur
                var newUser = new User
                {
                    Username = registerDto.Username,
                    PasswordHash = passwordHash,
                    Role = "User" // Varsayılan rol
                };

                // Kullanıcıyı veritabanına ekle
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok("Kullanıcı başarıyla oluşturuldu.");
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yapılabilir
                return StatusCode(500, "Kullanıcı kaydı sırasında bir hata oluştu.");
            }
        }
    }
} 