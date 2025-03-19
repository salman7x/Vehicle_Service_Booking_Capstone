using System.ComponentModel.DataAnnotations;

namespace Vehicle_Service_Booking.Models.ServicesFolder
{
    public class Services
    {
        [Key]

        public int ServiceId { get; set; }
        public string? ServiceName { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }


    }
}
