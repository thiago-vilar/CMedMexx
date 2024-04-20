//C:\Projetos\CMedMexx2\CMedMexx\WebAPI\Models\Room.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }
        public string? HospitalName { get; set; }
        public string? RoomName { get; set; }
        public bool IsBooked { get; set; }
        public int UserId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        [ForeignKey("UserId")]
        public User? Users { get; set; }

        public List<RoomAvailability> Availabilities { get; set; } = new List<RoomAvailability>();
        public List<RoomRental> Rentals { get; set; } = new List<RoomRental>();  // Adicionando a propriedade Rentals
    }

    public class RoomAvailability
    {
        [Key]
        public int Id { get; set; }
        public int RoomId { get; set; }

        [ForeignKey("RoomId")]
        public Room? Room { get; set; } // Corrigido para apontar para Room ao invés de Rooms

        public DateTime StartDateTime { get; set; } // Data de início da disponibilidade
        public DateTime EndDateTime { get; set; } // Data de fim da disponibilidade
    }
}

