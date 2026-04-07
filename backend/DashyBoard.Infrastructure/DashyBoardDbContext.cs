using DashyBoard.Domain.Models; 
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure
{
    public class DashyBoardDbContext : DbContext
    {
        public DashyBoardDbContext(DbContextOptions<DashyBoardDbContext> options): base(options){}

        public DbSet<User> Users { get; set; }
        public DbSet<Reminder> Reminders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.AuthSub).IsRequired();
                entity.Property(u => u.Email).IsRequired();

                entity.Property(u => u.Username).IsRequired(false);
                entity.Property(u => u.DisplayName).IsRequired(false);
                entity.Property(u => u.Country).IsRequired(false);
                entity.Property(u => u.City).IsRequired(false);

                entity.Property(u => u.CreatedAt).IsRequired();
                entity.HasIndex(u => u.AuthSub).IsUnique();
            });

            modelBuilder.Entity<Reminder>(entity =>
            {
                entity.HasKey(r => r.Id);
                entity.Property(r => r.Title).IsRequired();
                entity.Property(r => r.Note).IsRequired(false);
                entity.Property(r => r.DueAtUtc).IsRequired();
                entity.Property(r => r.IsCompleted).IsRequired();
                entity.Property(r => r.CreatedAtUtc).IsRequired();
                entity.Property(r => r.CompletedAtUtc).IsRequired(false);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(r => r.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
