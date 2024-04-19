//C:\Projetos\CMedMexx\WebAPI\Controllers\AuthController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(UserRegistrationDto userDto)
        {
            if (string.IsNullOrWhiteSpace(userDto.Role))
            {
                return BadRequest(new { IsSuccess = false, Message = "O perfil do usuário (Role) é obrigatório." });
            }

            try
            {
                var user = await _authService.SignUp(userDto);
                if (user == null)
                {
                    return BadRequest(new { IsSuccess = false, Message = "Registration failed." });
                }
                return Ok(new { IsSuccess = true, Message = "User registered successfully. Please log in." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        [HttpPost("signin")]
        public async Task<IActionResult> SignIn(UserLoginDto loginDto)
        {
            try
            {
                 var result = await _authService.SignIn(loginDto.Email, loginDto.Password);
                // Verifique se a tupla 'result' não é nula antes de acessar seus elementos
                if (result.Token == null)
                {
                    return Unauthorized(new { IsSuccess = false, Message = "Login failed." });
                }
                HttpContext.Response.Headers.Append("Authorization", $"Bearer {result.Token}");
                return Ok(new {
                    IsSuccess = true,
                    Message = "Login successful",
                    Token = result.Token,
                    Role = result.Role,
                    Username = result.Username,
                    Email = result.Email,
                    UserId = result.UserId
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
