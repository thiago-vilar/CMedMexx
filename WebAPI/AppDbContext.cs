using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<HospitalStaff> HospitalStaff { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomRental> RoomRentals { get; set; }
        public DbSet<RentedRoom> RentedRooms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RentedRoom>()
                .ToTable("RentedRooms")
                .HasKey(rr => new { rr.UserId, rr.RoomId });

            modelBuilder.Entity<RentedRoom>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(rr => rr.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RentedRoom>()
                .HasOne<Room>()
                .WithMany()
                .HasForeignKey(rr => rr.RoomId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
