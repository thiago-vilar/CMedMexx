using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Patient : User
    {
        [Key]
        public new int UserId { get; set; }  // Uso de 'new' para esconder intencionalmente

        public string Name { get; set; } = string.Empty;
        public string? CPF { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;

        public ICollection<Appointment> Appointments { get; set; }

        public Patient()
        {
            Appointments = new List<Appointment>();
        }
    }
}
