namespace Vehicle_Service_Booking.Models.Authentication
{
    public interface IAuthService
    {
        Task<string> Authenticate(string email, string password);
    }
}
