using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vehicle_Service_Booking.Models.Authentication;
using Vehicle_Service_Booking.Models.UserFolder;

namespace Vehicle_Service_Booking.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService  _userService;

        public AuthController(IAuthService authService , IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Vehicle_Service_Booking.Models.Login request)
        {
            var token = await _authService.Authenticate(request.Email, request.Password);
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("Invalid credentials");
            }

            // Fetch user details including role
            var user = await _userService.GetUserByEmail(request.Email);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            return Ok(new
            {
                Token = token,
                User = new
                {
                    Id = user.UserId,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

        [HttpGet("users/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmail(email);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(new
            {
                Id = user.UserId,
                Email = user.Email,
                Role = user.Role
            });
        }
    }
}
