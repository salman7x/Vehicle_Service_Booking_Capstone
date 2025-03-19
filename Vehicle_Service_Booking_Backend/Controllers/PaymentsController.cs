using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vehicle_Service_Booking.Models;
using Vehicle_Service_Booking.Models.PaymentFolder;

namespace Vehicle_Service_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly VehicleDbContext _context;

        public PaymentsController(VehicleDbContext context)
        {
            _context = context;
        }

        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
        {
            return await _context.Payments.ToListAsync();
        }

        // GET: api/Payments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // Dynamically fetching the bookingid and price before making payment
        [HttpGet("GetPaymentDetails/{bookingId}")]
        public async Task<ActionResult<object>> GetPaymentDetails(int bookingId)
        {
            // Fetch booking details
            var booking = await _context.Bookings
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
            {
                return NotFound("No booking found.");
            }

            // Fetch service price
            var service = await _context.Services
                .FirstOrDefaultAsync(s => s.ServiceId == booking.ServiceId);

            if (service == null)
            {
                return NotFound("Service details not found.");
            }

            return new
            {
                BookingId = booking.BookingId,
                AmountPaid = service.Price,
                //ServiceName = service.ServiceName, // Additional info
                PaymentDate = DateTime.UtcNow
            };
        }


        // PUT: api/Payments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        // POST: api/Payments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {

            var booking = await _context.Bookings.
                FirstOrDefaultAsync(bookingid => bookingid.BookingId == payment.BookingId);

            if(booking == null)
            {
                return BadRequest("Invalid BookingId. No such booking exists");
            }

            // fetching the price from service
            var service = await _context.Services.
                FirstOrDefaultAsync(serviceid => serviceid.ServiceId == payment.AmountPaid);

            if(service == null)
            {
                return BadRequest("Service is not selected for this booking");
            }

            payment.AmountPaid = service.Price;
            payment.PaymentDate = DateTime.UtcNow;


            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.PaymentId }, payment);
        }

        // DELETE: api/Payments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payments.Any(e => e.PaymentId == id);
        }
    }
}
