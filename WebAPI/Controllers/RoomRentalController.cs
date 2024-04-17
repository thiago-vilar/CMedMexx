using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using System.Linq;
using WebAPI; // Assegure-se de que o namespace inclua o AppDbContext

[Route("api/[controller]")]
[ApiController]
public class RoomRentalController : ControllerBase
{
    private readonly AppDbContext _context; // Corrigido para usar AppDbContext

    public RoomRentalController(AppDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    // POST: api/RoomRental
    [HttpPost]
    public IActionResult CreateRental([FromBody] RoomRental rental)
    {
        if (rental == null)
        {
            return BadRequest("Rental data is null.");
        }

        var user = _context.Users.FirstOrDefault(u => u.UserId == rental.UserId);
        if (user == null || !IsDoctor(user))
        {
            return BadRequest("Invalid user or user is not a doctor.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.RoomRentals.Add(rental);
        _context.SaveChanges();

        return CreatedAtAction("GetRental", new { id = rental.RoomRentalId }, rental);
    }

    private bool IsDoctor(User user)
    {
        // Simula uma verificação de role
        return user.Role.Equals("doctor", StringComparison.OrdinalIgnoreCase);
    }

    // Método para buscar um aluguel específico por ID
    [HttpGet("{id}")]
    public IActionResult GetRental(int id)
    {
        var rental = _context.RoomRentals.Find(id);
        if (rental == null)
        {
            return NotFound();
        }
        return Ok(rental);
    }
}
