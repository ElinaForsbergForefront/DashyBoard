using DashyBoard.Domain.Models;
using NUnit.Framework;

namespace DashyBoard.Domain.Tests.Spotify
{
    public class WhenCreatingSpotifyConnection
    {
        [Test]
        public void ThenShouldSetAllProperties()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var accessToken = "access-token";
            var refreshToken = "refresh-token";
            var expiresAtUtc = DateTime.UtcNow.AddHours(1);

            // Act
            var connection = new SpotifyConnection(userId, accessToken, refreshToken, expiresAtUtc);

            // Assert
            Assert.That(connection.UserId, Is.EqualTo(userId));
            Assert.That(connection.AccessToken, Is.EqualTo(accessToken));
            Assert.That(connection.RefreshToken, Is.EqualTo(refreshToken));
            Assert.That(connection.ExpiresAtUtc, Is.EqualTo(expiresAtUtc));
        }

        [Test]
        public void ThenShouldGenerateId()
        {
            // Arrange
            var userId = Guid.NewGuid();

            // Act
            var connection = new SpotifyConnection(
                userId,
                "access-token",
                "refresh-token",
                DateTime.UtcNow.AddHours(1));

            // Assert
            Assert.That(connection.Id, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void ThenShouldSetCreatedAndUpdatedTimestamps()
        {
            // Arrange
            var before = DateTime.UtcNow;

            // Act
            var connection = new SpotifyConnection(
                Guid.NewGuid(),
                "access-token",
                "refresh-token",
                DateTime.UtcNow.AddHours(1));

            var after = DateTime.UtcNow;

            // Assert
            Assert.That(connection.CreatedAtUtc, Is.InRange(before, after));
            Assert.That(connection.UpdatedAtUtc, Is.InRange(before, after));
        }
    }
}