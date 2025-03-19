using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vehicle_Service_Booking.Models;
using Vehicle_Service_Booking.Models.BookingFolder;

namespace Vehicle_Service_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Bookings1Controller : ControllerBase
    {
        private readonly VehicleDbContext _context;

        public Bookings1Controller(VehicleDbContext context)
        {
            _context = context;
        }

        // GET: api/Bookings1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bookings1>>> GetBookings()
        {
            return await _context.Bookings.ToListAsync();
        }

        // GET: api/Bookings1/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bookings1>> GetBookings1(int id)
        {
            var bookings1 = await _context.Bookings.FindAsync(id);

            if (bookings1 == null)
            {
                return NotFound();
            }

            return bookings1;
        }

        // Get th ebooked srvice history for the particular user 
        [HttpGet("bookedSevice/{userid}")]
        public async Task<ActionResult<IEnumerable<Bookings1>>> GetBookedServiceHistory (int userid)
        {
            var bookings = await _context.Bookings.Where(
                bookedhistory => bookedhistory.UserId == userid).ToListAsync();

            if(bookings == null)
            {
                return NotFound("No booking history for this user");
            }

            return Ok(bookings);
        }

        // PUT: api/Bookings1/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookings1(int id, Bookings1 bookings1)
        {
            if (id != bookings1.BookingId)
            {
                return BadRequest();
            }

            _context.Entry(bookings1).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Bookings1Exists(id))
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

        // POST: api/Bookings1
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Bookings1>> PostBookings1(Bookings1 bookings1)
        {
            if (bookings1 == null)
            {
                return BadRequest("Invalid booking data");
            }


            bookings1.BookingDate = DateTime.UtcNow;  
            bookings1.CreatedAt = DateTime.UtcNow;

            _context.Bookings.Add(bookings1);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBookings1", new { id = bookings1.BookingId }, bookings1);
        }

        // DELETE: api/Bookings1/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookings1(int id)
        {
            var bookings1 = await _context.Bookings.FindAsync(id);
            if (bookings1 == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(bookings1);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Bookings1Exists(int id)
        {
            return _context.Bookings.Any(e => e.BookingId == id);
        }
    }
}
