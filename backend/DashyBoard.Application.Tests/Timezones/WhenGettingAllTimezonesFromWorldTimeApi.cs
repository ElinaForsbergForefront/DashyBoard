using Moq;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.WorldTime;
using DashyBoard.Application.Queries.WorldTime.Dto;

namespace DashyBoard.Application.Tests.Timezones;

public class WhenGettingAllTimezonesFromWorldTimeApi
{
    [Test]
    public async Task ThenValidRequestShouldReturnFilteredTimezones()
    {
        // Arrange
        var expectedTimezones = new List<TimezoneDto>
        {
            new TimezoneDto("Europe/Stockholm"),
            new TimezoneDto("America/New_York"),
            new TimezoneDto("Asia/Tokyo"),
            new TimezoneDto("Australia/Sydney")
        };

        // Testet verifiera att handlern anropar klienten korrekt
        // och returnerar den data som den får tillbaka.
        var mockClient = new Mock<IWorldTimeApiClient>();
        mockClient
            .Setup(x => x.GetAllTimezonesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedTimezones);

        var handler = new GetAllTimezonesQueryHandler(mockClient.Object);

        // Act
        var result = await handler.Handle(
            new GetAllTimezonesQuery(),
            CancellationToken.None);

        // Assert
        Assert.That(result.Count, Is.EqualTo(4));
        Assert.That(result.First().TimeZone, Is.EqualTo("Europe/Stockholm"));
        Assert.That(result.Last().TimeZone, Is.EqualTo("Australia/Sydney"));
    }

    [Test]
    public async Task ThenRequestShouldOnlyContainGeographicTimezones()
    {
        // Arrange
        var expectedTimezones = new List<TimezoneDto>
        {
            new TimezoneDto("Europe/Stockholm"),
            new TimezoneDto("Africa/Cairo"),
            new TimezoneDto("Pacific/Auckland")
        };

        var mockClient = new Mock<IWorldTimeApiClient>();
        mockClient
            .Setup(x => x.GetAllTimezonesAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedTimezones);

        var handler = new GetAllTimezonesQueryHandler(mockClient.Object);

        // Act
        var result = await handler.Handle(
            new GetAllTimezonesQuery(),
            CancellationToken.None);

        // Assert
        Assert.That(result.All(tz => tz.TimeZone.Contains("/")), Is.True, 
            "All timezones should be in Continent/City format");
        Assert.That(result.Any(tz => tz.TimeZone.StartsWith("Europe/")), Is.True);
        Assert.That(result.Any(tz => tz.TimeZone.StartsWith("Africa/")), Is.True);
        Assert.That(result.Any(tz => tz.TimeZone.StartsWith("Pacific/")), Is.True);
    }

}