namespace DashyBoard.Domain.Models
{
    public class User
    {
        public Guid Id { get; private set; } 
        public string AuthSub { get; private set; } = null!;
        public string Email { get; private set; } = null!;
        public string? Username { get; private set; }
        public string? DisplayName { get; private set; }
        public string? Country { get; private set; }
        public string? City { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        public SpotifyConnection? SpotifyConnection { get; private set; }

        private User() { }

        public User(string authSub, string email, string? username = null, string? displayName = null, string? country = null, string? city = null)
        {
            Id = Guid.NewGuid();
            AuthSub = authSub;
            Email = email;
            Username = username;
            DisplayName = displayName;
            Country = country;
            City = city;
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(string? username, string? displayName, string? country, string? city)
        {
            Username = username;
            DisplayName = displayName;
            Country = country;
            City = city;
        }
    }
}
