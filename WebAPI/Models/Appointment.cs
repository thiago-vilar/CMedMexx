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
        public DateTime StartDateTime { get; set; } // Data e hora de início da consulta
        
        [Required]
        public DateTime EndDateTime { get; set; } // Data e hora de término da consulta
        
        [Required]
        public string Status { get; set; } = "Pendente"; // Status da consulta: Confirmado, Pendente, Cancelado
        
        [Required]
        public int DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public Doctor? Doctor { get; set; }

        [Required]
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        [Required]
        public int RoomId { get; set; }
        [ForeignKey("RoomId")]
        public Room? Room { get; set; }
    }
}
