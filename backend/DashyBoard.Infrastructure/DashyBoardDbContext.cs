using DashyBoard.Domain.Models; 
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure
{
    public class DashyBoardDbContext : DbContext
    {
        public DashyBoardDbContext(DbContextOptions<DashyBoardDbContext> options): base(options){}

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.AuthSub).IsRequired();
                entity.Property(u => u.Email).IsRequired(false);

                entity.Property(u => u.Username).IsRequired(false);
                entity.Property(u => u.DisplayName).IsRequired(false);
                entity.Property(u => u.Country).IsRequired(false);
                entity.Property(u => u.City).IsRequired(false);

                entity.Property(u => u.CreatedAt).IsRequired();
            });
        }
    }
}
