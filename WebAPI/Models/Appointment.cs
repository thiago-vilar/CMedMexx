// Caminho: C:\Projetos\CMedMexx\WebAPI\Models\Appointment.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Appointment
    {
        [Key]
        public int AppointmentId { get; set; }

        [Required]
        public DateTime Start { get; set; } // Data e hora de início do compromisso

        [Required]
        public DateTime End { get; set; } // Data e hora de término do compromisso

        [Required]
        public bool IsConfirmed { get; set; } // Se o compromisso está confirmado

        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Required]
        public int RoomRentalId { get; set; }
        [ForeignKey("RoomRentalId")]
        public RoomRental? RoomRental { get; set; }
    }
}
