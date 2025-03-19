using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vehicle_Service_Booking.Models;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using Microsoft.CodeAnalysis.Scripting;
using Vehicle_Service_Booking.Models.Authentication;
using Vehicle_Service_Booking.Models.UserFolder;

namespace Vehicle_Service_Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly VehicleDbContext _context;
        private readonly IAuthService _authService;

        public UsersController(VehicleDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        [HttpPost("register")]
        public async Task<ActionResult<Users>> RegisterUser([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new Users
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = hashedPassword, // Hashed Password stored
                Role = request.Role ?? "User",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUsers), new { id = newUser.UserId }, newUser);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }
            return users;
        }

        [HttpGet("users/{mechanic}")]
        public async Task<ActionResult<IEnumerable<Users>>> GetMechanics()
        {
            var mechanics = await _context.Users.Where(user => user.Role.ToLower() == "Mechanic").ToListAsync();

            if (!mechanics.Any())
            {
                return NotFound("No Mechanics Found");
            }

            return Ok(mechanics);
        }

        // Update User
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsers(int id, Users users)
        {
            if (id != users.UserId)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
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

        // Register User API
        

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsers(int id)
        {
            var users = await _context.Users.FindAsync(id);
            if (users == null)
            {
                return NotFound();
            }

            _context.Users.Remove(users);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsersExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }

    
}
