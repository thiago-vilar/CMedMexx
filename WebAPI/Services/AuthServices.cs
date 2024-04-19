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
        Task<(string Token, string Role, string Username, string Email, int UserId)> SignIn(string email, string password);
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

        public async Task<(string Token, string Role, string Username, string Email, int UserId)> SignIn(string email, string password)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                throw new InvalidOperationException("Invalid credentials.");
            }

            if (_passwordHasher.VerifyHashedPassword(user, user.Password, password) != PasswordVerificationResult.Success)
            {
                throw new InvalidOperationException("Invalid password.");
            }

            return (GenerateJwtToken(user), user.Role, user.Username, user.Email, user.UserId);
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured properly."));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),
                Expires = DateTime.UtcNow.AddDays(30),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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