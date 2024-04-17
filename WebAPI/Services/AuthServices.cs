//C:\Projetos\CMedMexx\WebAPI\Services\AuthServices.cs

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebAPI.Models;
using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IAuthService
    {
        Task<(string Token, string Role, string Username)> SignIn(string email, string password);
        Task<User> SignUp(UserRegistrationDto registration);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _configuration = configuration;
        }

        public async Task<(string Token, string Role, string Username)> SignIn(string email, string password)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.Password, password) != PasswordVerificationResult.Success)
            {
                throw new InvalidOperationException("Invalid credentials.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured properly.");
            var key = Encoding.ASCII.GetBytes(keyString);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    // Aqui é feita a correção, trocando para um tipo de claim padrão que vai armazenar o UserId
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return (tokenHandler.WriteToken(token), user.Role, user.Username);
        }


        public async Task<User> SignUp(UserRegistrationDto registration)
        {
            if (string.IsNullOrEmpty(registration.Role))
            {
                throw new ArgumentException("Role is required.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.Email == registration.Email);
            if (userExists)
            {
                throw new InvalidOperationException("User already exists.");
            }

            var newUser = new User
            {
                Username = registration.Username,
                Email = registration.Email,
                Role = registration.Role,               
            };

            newUser.Password = _passwordHasher.HashPassword(newUser, registration.Password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
    }
}