// Assegure-se de que todos os namespaces necessários estão sendo usados:
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using WebAPI.Models; // Certifique-se de que o namespace do modelo Room está correto
using Microsoft.EntityFrameworkCore; // Necessário para DbContext e DbUpdateException

namespace WebAPI.Controllers
{
    [ApiController] // Verifique se ApiController está disponível na versão do .NET Core/ASP.NET Core que você está utilizando
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RoomController> _logger;

        public RoomController(AppDbContext context, ILogger<RoomController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/room/{userId}
        [HttpGet("hospitalstaff/{userId}")]
        public IActionResult GetRooms(int userId)
        {
            var rooms = _context.Rooms.Where(r => r.UserId == userId)
                                    .Select(room => new
                                    {
                                        room.RoomId,
                                        room.HospitalName,
                                        room.RoomName,
                                        room.IsBooked,
                                        Start = room.Start.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                                        End = room.End.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                                        room.UserId
                                    }).ToList();
            return Ok(rooms);
        }

        // GET: api/room/available
        [HttpGet("available")]
        public IActionResult GetAvailableRooms()
        {
            // Cria uma data 'today' em UTC
            var today = DateTime.UtcNow.Date;

            var rooms = _context.Rooms.Where(room => room.Start >= today)
                                    .Select(room => new
                                    {
                                        room.RoomId,
                                        room.HospitalName,
                                        room.RoomName,
                                        room.IsBooked,
                                        Start = room.Start.ToString("yyyy-MM-ddTHH:mm:ssZ"), // Formatação ISO 8601
                                        End = room.End.ToString("yyyy-MM-ddTHH:mm:ssZ"),     // Formatação ISO 8601
                                        room.UserId
                                    }).ToList();
            return Ok(rooms);
        }

       // PATCH: api/room/book/{roomId}
        [HttpPatch("book/{roomId}")]
        public async Task<IActionResult> BookRoom(int roomId, [FromBody] BookingDetails details)
        {
            var room = await _context.Rooms.FirstOrDefaultAsync(r => r.RoomId == roomId);

            if (room == null)
            {
                return NotFound("Room not found.");
            }

            if (room.IsBooked)
            {
                return BadRequest("Room is already booked.");
            }

            // Cria uma nova reserva de quarto
            var rental = new RoomRental
            {
                RoomId = roomId,
                UserId = details.DoctorId,
                Start = details.StartDateTime,
                End = details.EndDateTime,
            };
            _context.RoomRentals.Add(rental);

            // Atualiza o status do quarto
            room.IsBooked = true;
            _context.Rooms.Update(room);

            await _context.SaveChangesAsync();

            return Ok("Room booked successfully.");
        }

        public class BookingDetails
        {
            public DateTime StartDateTime { get; set; }
            public DateTime EndDateTime { get; set; }

            public int DoctorId { get; set; }
        }


        // Adiciona um novo quarto
        [HttpPost("add")]
        public async Task<IActionResult> AddRoom([FromBody] Room room)
        {
            if (room == null || string.IsNullOrEmpty(room.HospitalName) || string.IsNullOrEmpty(room.RoomName) || room.UserId == 0)
            {
                return BadRequest("Invalid room data.");
            }

            try
            {
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Room added successfully", room });
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError($"Database update error: {dbEx.InnerException?.Message ?? dbEx.Message}");
                return StatusCode(500, "Database update error. Please check the logs for more details.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Internal server error: {ex.Message}");
                return StatusCode(500, "Internal server error. Please check the logs for more details.");
            }
        }
    }
}
