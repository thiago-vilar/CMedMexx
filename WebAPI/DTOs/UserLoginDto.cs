//C:\Projetos\CMedMexx\WebAPI\DTOs\UserLoginDto.cs

namespace WebAPI.DTOs
{
    public class UserLoginDto
    {
        public UserLoginDto()
        {
            Email = string.Empty;
            Password = string.Empty;
        }

        public string Email { get; set; }
        public string Password { get; set; }
    }
}