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

        // Endpoint para cadastro de usuários
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
                    throw new Exception("Registration failed.");
                }
                // Registro bem-sucedido, retorna uma mensagem e indiretamente sugere redirecionamento para SignIn
                return Ok(new { IsSuccess = true, Message = "User registered successfully. Please log in." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { IsSuccess = false, Message = ex.Message });
            }
        }

        // Endpoint para login de usuários
        [HttpPost("signin")]
        public async Task<IActionResult> SignIn(UserLoginDto loginDto)
        {
            try
            {
                var (Token, Role, Username) = await _authService.SignIn(loginDto.Email, loginDto.Password);
                if (Token == null)
                {
                    throw new Exception("Login failed.");
                }
                return Ok(new { IsSuccess = true, Message = "Login successful", Token, Role, Username });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { IsSuccess = false, Message = ex.Message });
            }
        }
    }
}
