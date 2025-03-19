using System.ComponentModel.DataAnnotations;

namespace Vehicle_Service_Booking.Models.UserFolder

{
    public class Users
    {
        [Key]

        public int UserId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }

        public string? PasswordHash { get; set; }

        public string? Role { get; set; }

        public DateTime? CreatedAt { get; set; }

    }
}
