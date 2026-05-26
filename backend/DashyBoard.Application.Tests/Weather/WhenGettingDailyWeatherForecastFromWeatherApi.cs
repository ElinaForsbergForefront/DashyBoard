using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace DashyBoard.Application.Tests.Weather
{
    public class WhenGettingDailyWeatherForecastFromWeatherApi
    {
        [Test]

        public async Task ThenValidRequestShouldReturnDailyWeatherForecast()
        {
            // Arrange
            var expectedForecast = new RawDailyWeatherForecastDto(
                59,
                18,
                new RawDailyForecastData(
                    ["2024 - 06 - 01T00:00:00Z"],
                    [0],
                    [10.1],
                    [3, 2]
                )
            );
            var mockClient = new Mock<IWeatherApiClient>();
            mockClient.Setup(client => client.GetDailyWeatherForecastAsync("18", "59", It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedForecast);

            var mockCache = new Mock<IMemoryCache>();
            object? cacheValue = null;
            mockCache.Setup(x => x.TryGetValue(It.IsAny<object>(), out cacheValue)).Returns(false);
            mockCache.Setup(x => x.CreateEntry(It.IsAny<object>())).Returns(Mock.Of<ICacheEntry>());

            var handler = new GetDailyWeatherForecastQueryHandler(mockClient.Object, mockCache.Object);

            // Act
            var result = await handler.Handle(
                new GetDailyWeatherForecastQuery("18", "59"),
                CancellationToken.None
            );

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Latitude, Is.EqualTo(59));
            Assert.That(result.Longitude, Is.EqualTo(18));
            Assert.That(result.Daily.Time, Is.EqualTo(expectedForecast.Daily.Time));
        }

    }
}
