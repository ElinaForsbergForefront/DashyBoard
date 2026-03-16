using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Weather;
using DashyBoard.Application.Queries.Weather.Dto;
using Moq;

namespace DashyBoard.Application.Tests.Weather
{
    public class WhenGettingHourlyWeatherForecastFromWeatherApi
    {
        [Test]

        public async Task ThenValidRequestShouldReturnWeatherForecast()
        {
            // Arrange
            var expectedForecast = new RawHourlyWeatherForecastDto(
                59,
                18,
                new RawHourlyForecastData(
                    ["2024-06-01T00:00:00Z"],
                    [15.5],
                    [0],
                    [0.3],
                    [5.0],
                    [1]
                )
            );

            var mockClient = new Mock<IWeatherApiClient>();
            mockClient.Setup(client => client.GetHourlyWeatherForecastAsync("10", "10", It.IsAny<CancellationToken>()))
                      .ReturnsAsync(expectedForecast);

            var handler = new GetHourlyWeatherForecastQueryHandler(mockClient.Object);

            // Act
            var result = await handler.Handle(
                new GetHourlyWeatherForecastQuery("10", "10"),
                CancellationToken.None);

            // Assert
            Assert.That(result.Latitude, Is.EqualTo(59));
            Assert.That(result.Longitude, Is.EqualTo(18));
            Assert.That(result.Hourly.Time, Is.EqualTo(expectedForecast.Hourly.Time));
        }
    }
}
