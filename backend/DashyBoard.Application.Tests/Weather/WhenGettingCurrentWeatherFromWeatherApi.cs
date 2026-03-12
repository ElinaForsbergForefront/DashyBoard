using DashyBoard.Application.Queries.Weather.Dto;
using DashyBoard.Application.Queries.Weather;
using DashyBoard.Application.Interfaces;
using DashyBoard.Domain.Models;
using Moq;

namespace DashyBoard.Application.Tests.Weather
{
    public class WhenGettingCurrentWeatherFromWeatherApi
    {
        [Test]
        public async Task ThenValidRequestShouldReturnCurrentWeather()
        {
            // Arrange
            var expectedWeather = new RawCurrentWeatherDto(
                59,
                18,
                new RawWeatherData(
                    15.5,
                    10,
                    1,
                    0,
                    5.0,
                    10.0
                )
            );

            var mockClient = new Mock<IWeatherApiClient>();
            mockClient
                .Setup(x => x.GetCurrentWeatherAsync("10", "10", It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedWeather);

            var handler = new GetCurrentWeatherQueryHandler(mockClient.Object);

            // Act
            var result = await handler.Handle(
                new GetCurrentWeatherQuery("10", "10"),
                CancellationToken.None
            );

            // Assert
            Assert.That(result.Latitude, Is.EqualTo(59));
            Assert.That(result.Longitude, Is.EqualTo(18));
            Assert.That(result.Current.WeatherCode, Is.EqualTo((WeatherType)0));
        }
    }
}
