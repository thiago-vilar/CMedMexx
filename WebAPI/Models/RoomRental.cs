// Caminho: C:\Projetos\CMedMexx\WebAPI\Models\RoomRental.cs

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class RoomRental
    {
        [Key]
        public int RoomRentalId { get; set; }

        [Required]
        public int RoomId { get; set; } // Referência à sala que está sendo alugada
        
        [Required]
        public int UserId { get; set; } // Identificador do usuário que aluga a sala
       
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public bool IsConfirmed { get; set; }

        [ForeignKey("RoomId")]
        public Room? Room { get; set; } // Relação de dependência com Room tornada anulável

        [ForeignKey("UserId")]
        public User? User { get; set; } // Relação de dependência com User tornada anulável
    }
}