using System;
using Microsoft.EntityFrameworkCore;
using Vehicle_Service_Booking.Models.Authentication;

namespace Vehicle_Service_Booking.Models.UserFolder
{
    public class UserService : IUserService
    {
        private readonly VehicleDbContext _context;

        public UserService(VehicleDbContext context)
        {
            _context = context;
        }

        public async Task<Users> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

    }
}
