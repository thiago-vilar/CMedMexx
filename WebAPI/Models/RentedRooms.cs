using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class RentedRoom
    {
        // Construtor padrão para uso do EF
        public RentedRoom() {}

        // Chave primária com geração automática
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RentedRoomId { get; set; }

        // Chave estrangeira para User
        [ForeignKey("User")]
        public int UserId { get; set; }

        // Chave estrangeira para Room
        [ForeignKey("Room")]
        public int RoomId { get; set; }

        // Propriedades de navegação
        public User User { get; set; }
        public Room Room { get; set; }
    }
}
