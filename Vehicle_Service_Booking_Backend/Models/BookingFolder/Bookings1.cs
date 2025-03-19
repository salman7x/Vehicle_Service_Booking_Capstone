using System.ComponentModel.DataAnnotations;

namespace Vehicle_Service_Booking.Models.BookingFolder

{
    public class Bookings1
    {
        [Key]

        public int BookingId { get; set; }
        public int? VehicleId { get; set; }
        public int? ServiceId { get; set; }
        public int? UserId { get; set; }

        public DateTime BookingDate { get; set; }

        public string? Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; }

        
    }
}
