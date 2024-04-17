// Caminho: C:\Projetos\CMedMexx\WebAPI\Models\Doctor.cs

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebAPI.Models
{
    public class Doctor
        {
            [Key]
            public int DoctorId { get; set; }
            public string Name { get; set; } = string.Empty;
            public string CRM { get; set; } = string.Empty;
            public string? CPF { get; set; } = string.Empty;
            public string? PhoneNumber { get; set; } = string.Empty;
            public string? Address { get; set; } = string.Empty;

            public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
            public List<RoomRental> Rentals { get; set; } = new List<RoomRental>();  // Adicionando a propriedade Rentals
        }
}
