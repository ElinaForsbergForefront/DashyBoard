using DashyBoard.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure
{
    public class DashyBoardDbContext : DbContext
    {
        public DashyBoardDbContext(DbContextOptions<DashyBoardDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Reminder> Reminders { get; set; }
        public DbSet<UserRelationship> UserRelationships { get; set; }
        public DbSet<Poke> Pokes { get; set; }
        public DbSet<SpotifyConnection> SpotifyConnections { get; set; }

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
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Username).IsUnique();
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

            modelBuilder.Entity<UserRelationship>(entity =>
            {
                entity.HasKey(ur => ur.Id);

                entity.Property(ur => ur.User1Id).IsRequired();
                entity.Property(ur => ur.User2Id).IsRequired();

                entity.Property(ur => ur.RequestedByUserId).IsRequired();
                entity.Property(ur => ur.ActionByUserId).IsRequired();

                entity.Property(ur => ur.Status)
                      .HasConversion<int>()
                      .IsRequired();

                entity.Property(ur => ur.CreatedAtUtc).IsRequired();
                entity.Property(ur => ur.UpdatedAtUtc).IsRequired();
                entity.Property(ur => ur.RespondedAtUtc).IsRequired(false);
                entity.Property(ur => ur.BlockedAtUtc).IsRequired(false);

                entity.HasIndex(ur => new { ur.User1Id, ur.User2Id }).IsUnique();

                entity.ToTable(t => t.HasCheckConstraint("CK_UserRelationships_DifferentUsers", "\"User1Id\" <> \"User2Id\""));

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(ur => ur.User1Id)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(ur => ur.User2Id)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(ur => ur.RequestedByUserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(ur => ur.ActionByUserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Poke>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.RelationshipId).IsRequired();
                entity.Property(p => p.FromUserId).IsRequired();
                entity.Property(p => p.ToUserId).IsRequired();

                entity.Property(p => p.CreatedAtUtc).IsRequired();
                entity.Property(p => p.SeenAtUtc).IsRequired(false);
                entity.Property(p => p.IsActive).IsRequired();

                entity.HasIndex(p => p.RelationshipId);

                entity.HasOne<UserRelationship>()
                      .WithMany()
                      .HasForeignKey(p => p.RelationshipId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(p => p.FromUserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(p => p.ToUserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<SpotifyConnection>(entity =>
            {
                entity.HasKey(sc => sc.Id);

                entity.Property(sc => sc.UserId).IsRequired();

                entity.Property(sc => sc.AccessToken).IsRequired();
                entity.Property(sc => sc.RefreshToken).IsRequired();
                entity.Property(sc => sc.ExpiresAtUtc).IsRequired();

                entity.Property(sc => sc.CreatedAtUtc).IsRequired();
                entity.Property(sc => sc.UpdatedAtUtc).IsRequired();

                entity.HasIndex(sc => sc.UserId).IsUnique();

                entity.HasOne(sc => sc.User)
                      .WithOne(u => u.SpotifyConnection)
                      .HasForeignKey<SpotifyConnection>(sc => sc.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}