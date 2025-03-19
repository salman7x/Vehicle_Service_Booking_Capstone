using System.ComponentModel.DataAnnotations;

namespace Vehicle_Service_Booking.Models.VehiclesFolder
{
    public class Vehicles
    {
        [Key]
        public int VehicleId { get; set; }

        public int UserId { get; set; }

        public string? Make { get; set; }

        public string? Model { get; set; }

        public int Year { get; set; }

        public string? LicensePlate { get; set; }

        public DateTime? CreatedAt { get; set; }

    }
}
