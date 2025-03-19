using System.ComponentModel.DataAnnotations;

namespace Vehicle_Service_Booking.Models.PaymentFolder
{
    public class Payment
    {
        [Key]

        public int PaymentId { get; set; }
        public int BookingId { get; set; }

        public decimal AmountPaid { get; set; }

        public DateTime PaymentDate { get; set; }

        public string? PaymentMethod { get; set; }

        
    }
}
