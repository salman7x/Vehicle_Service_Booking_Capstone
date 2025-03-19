namespace Vehicle_Service_Booking.Models.UserFolder

{
    public interface IUserService
    {
        Task<Users> GetUserByEmail(string email);
    }

}

