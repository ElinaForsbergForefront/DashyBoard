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
            base.OnModelCreating(modelBuilder);
        }
    }
}
