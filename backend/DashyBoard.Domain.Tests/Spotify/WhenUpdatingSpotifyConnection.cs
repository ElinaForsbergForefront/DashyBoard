using DashyBoard.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
namespace DashyBoard.Domain.Tests.Spotify
{

    public class WhenUpdatingSpotifyConnection
    {
        [Test]
        public void ThenShouldUpdateAccessToken()
        {
            // Arrange
            var connection = new SpotifyConnection(
                Guid.NewGuid(),
                "old-access-token",
                "old-refresh-token",
                DateTime.UtcNow.AddHours(1));

            // Act
            connection.UpdateTokens(
                "new-access-token",
                "new-refresh-token",
                DateTime.UtcNow.AddHours(2));

            // Assert
            Assert.That(connection.AccessToken, Is.EqualTo("new-access-token"));
        }

        [Test]
        public void ThenShouldUpdateRefreshToken_WhenRefreshTokenIsProvided()
        {
            // Arrange
            var connection = new SpotifyConnection(
                Guid.NewGuid(),
                "old-access-token",
                "old-refresh-token",
                DateTime.UtcNow.AddHours(1));

            // Act
            connection.UpdateTokens(
                "new-access-token",
                "new-refresh-token",
                DateTime.UtcNow.AddHours(2));

            // Assert
            Assert.That(connection.RefreshToken, Is.EqualTo("new-refresh-token"));
        }

        [Test]
        public void ThenShouldUpdateUpdatedAtTimestamp()
        {
            // Arrange
            var connection = new SpotifyConnection(
                Guid.NewGuid(),
                "access-token",
                "refresh-token",
                DateTime.UtcNow.AddHours(1));

            var oldUpdatedAtUtc = connection.UpdatedAtUtc;

            Thread.Sleep(10);

            // Act
            connection.UpdateTokens(
                "new-access-token",
                "new-refresh-token",
                DateTime.UtcNow.AddHours(2));

            // Assert
            Assert.That(connection.UpdatedAtUtc, Is.GreaterThan(oldUpdatedAtUtc));
        }
    }
}