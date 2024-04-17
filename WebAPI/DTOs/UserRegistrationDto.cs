//C:\Projetos\CMedMexx\WebAPI\DTOs\UserRegistrationDto.cs

namespace WebAPI.DTOs
{
    public class UserRegistrationDto
    {
        public UserRegistrationDto()
        {
            Username = string.Empty;
            Email = string.Empty;
            Password = string.Empty;
            Role = string.Empty;
        }

        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}