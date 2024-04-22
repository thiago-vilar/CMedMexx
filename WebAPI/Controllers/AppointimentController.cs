using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using WebAPI.Models;  // Garanta que o namespace dos modelos esteja correto
using WebAPI;        // Namespace que contém o AppDbContext

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentController(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // GET: api/Appointment
        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointment = await _context.Appointment
                                             .Include(a => a.User)
                                             .Include(a => a.RoomRental)
                                             .ToListAsync();
            return Ok(appointment);
        }

        // GET: api/Appointment/doctor/{userId}
        [HttpGet("doctor/{userId}")]
        public async Task<IActionResult> GetAppointmentsByUserId(int userId)
        {
            var appointments = await _context.Appointment
                                            .Include(a => a.User)
                                            .Include(a => a.RoomRental)
                                            .Where(a => a.RoomRental!.UserId == userId)

                                            .ToListAsync();
            if (!appointments.Any())
            {
                return Ok(new List<Appointment>());
            }

            return Ok(appointments);
        }


        // GET: api/Appointment/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _context.Appointment
                                            .Include(a => a.User)
                                            .Include(a => a.RoomRental)
                                            .FirstOrDefaultAsync(a => a.AppointmentId == id);
            if (appointment == null)
            {
                return NotFound();
            }
            return Ok(appointment);
        }

        
        // POST: api/Appointment
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {   
            Console.WriteLine(appointment);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Appointment.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.AppointmentId }, appointment);
        }

        // PUT: api/Appointment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment appointment)
        {
            if (id != appointment.AppointmentId)
            {
                return BadRequest();
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Appointment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointment.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointment.Any(a => a.AppointmentId == id);
        }

        // PATCH: api/Appointment/confirm/5
        [HttpPatch("confirm/{id}")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointment.FindAsync(id);
            if (appointment == null)
            {
                return NotFound($"No appointment found with ID {id}.");
            }

            if (appointment.IsConfirmed)
            {
                return BadRequest("Appointment is already confirmed.");
            }

            appointment.IsConfirmed = true;
            _context.Appointment.Update(appointment);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException )
            {
                // Log exception here using your preferred logging framework
                return StatusCode(500, "An error occurred while updating the appointment. Please try again later.");
            }

            return Ok($"Appointment with ID {id} has been confirmed.");
        }

    }
}
