using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Spotify;
using DashyBoard.Application.Queries.Spotify.Dto;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Tests.Spotify
{
    public class WhenGettingSpotifyNowPlaying
    {
        private Mock<ISpotifyApiClient> _spotifyServiceMock = null!;
        private GetSpotifyNowPlayingQueryHandler _handler = null!;

        [SetUp]
        public void SetUp()
        {
            _spotifyServiceMock = new Mock<ISpotifyApiClient>();
            _handler = new GetSpotifyNowPlayingQueryHandler(_spotifyServiceMock.Object);
        }

        [Test]
        public async Task ThenShouldReturnNowPlaying_WhenSpotifyReturnsTrack()
        {
            // Arrange
            var expected = new SpotifyNowPlayingDto
            {
                TrackName = "Blinding Lights",
                ArtistName = "The Weeknd",
                AlbumName = "After Hours",
                AlbumImageUrl = "https://image.url/cover.jpg",
                IsPlaying = true,
            };

            var userId = Guid.NewGuid();

            _spotifyServiceMock
                .Setup(x => x.GetNowPlayingAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var query = new GetSpotifyNowPlayingQuery(userId);

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Not. Null);
            Assert.That(result.TrackName, Is.EqualTo("Blinding Lights"));
            Assert.That(result.ArtistName, Is.EqualTo("The Weeknd"));
            Assert.That(result.AlbumName, Is.EqualTo("After Hours"));
            Assert.That(result.AlbumImageUrl, Is.EqualTo("https://image.url/cover.jpg"));
            Assert.That(result.IsPlaying, Is.True);
        }

        [Test]
        public async Task ThenShouldReturnNull_WhenNothingIsPlaying()
        {
            // Arrange
            var userId = Guid.NewGuid();

            _spotifyServiceMock
                .Setup(x => x.GetNowPlayingAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((SpotifyNowPlayingDto?)null);

            var query = new GetSpotifyNowPlayingQuery(userId);

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task ThenShouldCallSpotifyServiceOnce()
        {
            // Arrange
            var userId = Guid.NewGuid();

            _spotifyServiceMock
                .Setup(x => x.GetNowPlayingAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new SpotifyNowPlayingDto
                {
                    TrackName = "Blinding Lights",
                    ArtistName = "The Weeknd",
                    IsPlaying = true
                });

            var query = new GetSpotifyNowPlayingQuery(userId);

            // Act
            await _handler.Handle(query, CancellationToken.None);

            // Assert
            _spotifyServiceMock.Verify(
                x => x.GetNowPlayingAsync(userId, It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}
