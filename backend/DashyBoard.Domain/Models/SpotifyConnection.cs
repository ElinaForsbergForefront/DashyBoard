using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Domain.Models
{
    public class SpotifyConnection
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }

        public string AccessToken { get; private set; } = string.Empty;
        public string RefreshToken { get; private set; } = string.Empty;
        public DateTime ExpiresAtUtc { get; private set; }

        public DateTime CreatedAtUtc { get; private set; }
        public DateTime UpdatedAtUtc { get; private set; }

        public User User { get; private set; } = null!;

        private SpotifyConnection() { }

        public SpotifyConnection(Guid userId, string accessToken, string refreshToken, DateTime expiresAtUtc)
        {
            Id = Guid.NewGuid();
            UserId = userId;
            AccessToken = accessToken;
            RefreshToken = refreshToken;
            ExpiresAtUtc = expiresAtUtc;
            CreatedAtUtc = DateTime.UtcNow;
            UpdatedAtUtc = DateTime.UtcNow;
        }

        public void UpdateTokens(string accessToken, string? refreshToken, DateTime expiresAtUtc)
        {
            AccessToken = accessToken;

            if (!string.IsNullOrWhiteSpace(refreshToken))
            {
                RefreshToken = refreshToken;
            }

            ExpiresAtUtc = expiresAtUtc;
            UpdatedAtUtc = DateTime.UtcNow;
        }
    }
}
