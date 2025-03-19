using System.ComponentModel.DataAnnotations;

namespace Vehicle_Service_Booking.Models
{
    public class Login
    {
        [Key]
        public string? Email { get; set; }
        public string? Password { get; set; }

        public string? Role { get; set; }
    }
}
