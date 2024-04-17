//C:\Projetos\CMedMexx\WebAPI\Controllers\RoomController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/room
        [HttpGet]
        public IActionResult GetRooms()
        {
            var rooms = _context.Rooms.Select(room => new
            {
                room.HospitalName,
                room.RoomName,
                room.IsBooked,
                Start = room.Start.ToString("dd-MM-yyyy"),
                End = room.End.ToString("dd-MM-yyyy"),
                room.UserId
            }).ToList();
            return Ok(rooms);
        }

        // POST: api/room/add
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddRoom([FromBody] Room room)
        {
            if (room == null || string.IsNullOrEmpty(room.HospitalName) || string.IsNullOrEmpty(room.RoomName))
            {
                return BadRequest("Invalid room data.");
            }

            // Extracts the UserId from the logged-in user's claim
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID is not found. Please ensure you are logged in.");
            }

            room.UserId = int.Parse(userId); // Assuming UserId is an integer

            try
            {
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Room added successfully", room });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, $"Database update error: {dbEx.InnerException?.Message ?? dbEx.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

