using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PetAPI.Data;
using PetAPI.Dtos.User;
using PetAPI.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PetAPI.Controllers
{
    /// <summary>
    /// Kimlik doğrulama işlemleri için controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// Yeni kullanıcı kaydı oluşturur
        /// </summary>
        /// <param name="registerDto">Kullanıcı kayıt bilgileri</param>
        /// <returns>Kayıt işlemi sonucu</returns>
        /// <response code="200">Kullanıcı başarıyla oluşturuldu</response>
        /// <response code="400">Geçersiz veri veya kullanıcı adı zaten alınmış</response>
        /// <response code="500">Sunucu hatası</response>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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

        /// <summary>
        /// Kullanıcı girişi yapar ve JWT döndürür
        /// </summary>
        /// <param name="loginDto">Kullanıcı giriş bilgileri</param>
        /// <returns>JWT token veya hata mesajı</returns>
        /// <response code="200">Giriş başarılı, JWT token döndürülür</response>
        /// <response code="401">Geçersiz kullanıcı adı veya şifre</response>
        /// <response code="500">Sunucu hatası</response>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    return Unauthorized("Geçersiz kullanıcı adı veya şifre.");
                }

                var token = GenerateJwtToken(user);

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama yapılabilir
                return StatusCode(500, "Giriş işlemi sırasında bir hata oluştu.");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}