using System.Numerics;
using Microsoft.EntityFrameworkCore;
using Vehicle_Service_Booking.Models.BookingFolder;
using Vehicle_Service_Booking.Models.PaymentFolder;
using Vehicle_Service_Booking.Models.ServicesFolder;
using Vehicle_Service_Booking.Models.UserFolder;
using Vehicle_Service_Booking.Models.VehiclesFolder;

namespace Vehicle_Service_Booking.Models
{
    public class VehicleDbContext : DbContext
    {
        public VehicleDbContext(DbContextOptions<VehicleDbContext> options) : base(options)
        {
        }
        //OnConfiguring() method is used to select and configure the data source
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Users>().ToTable("Users");
            modelBuilder.Entity<Vehicles>().ToTable("Vehicles");
            modelBuilder.Entity<Bookings1>().ToTable("Bookings");
            modelBuilder.Entity<Services>().ToTable("Services");
            modelBuilder.Entity<Payment>().ToTable("Payments");
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Vehicles> Vehicles { get; set; } = default!;

        public DbSet<Bookings1> Bookings { get; set; }
        public DbSet<Services> Services { get; set; }
        public DbSet<Payment> Payments { get; set; }



    }
}
