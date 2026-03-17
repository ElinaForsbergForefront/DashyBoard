using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetStopByName;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;


namespace DashyBoard.Application.Tests.Traffic;

public class WhenGettingStopsByNameFromTrafficApi
{
    private readonly ITrafficApiClient _trafficApiClient = Substitute.For<ITrafficApiClient>();
    private readonly GetStopByNameQueryHandler _handler;

    public WhenGettingStopsByNameFromTrafficApi()
    {
        _handler = new GetStopByNameQueryHandler(_trafficApiClient);
    }

    [Test]
    public async Task ShouldReturnStations_WhenNameMatches()
    {
        // Arrange
        var expected = new List<StationDto>
        {
            new("740009236", "Lund Solbjer", "28845", "Lund Solbjer", 55.718407, 13.234202, ["BUS", "TRAM"])
        };
        _trafficApiClient
            .GetStopByNameAsync("Lund", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(new GetStopByNameQuery("Lund"), CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result[0].GroupId.Should().Be("740009236");
        result[0].GroupName.Should().Be("Lund Solbjer");
        result[0].Id.Should().Be("28845");
        result[0].Name.Should().Be("Lund Solbjer");
        result[0].TransportModes.Should().Contain("BUS");
        result[0].TransportModes.Should().Contain("TRAM");
    }

    [Test]
    public async Task ShouldReturnEmptyList_WhenNoMatchFound()
    {
        // Arrange
        _trafficApiClient
            .GetStopByNameAsync("XYZ", Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        var result = await _handler.Handle(new GetStopByNameQuery("XYZ"), CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldCallApiWithCorrectName()
    {
        // Arrange
        _trafficApiClient
            .GetStopByNameAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        await _handler.Handle(new GetStopByNameQuery("Lund"), CancellationToken.None);

        // Assert
        await _trafficApiClient
            .Received(1)
            .GetStopByNameAsync("Lund", Arg.Any<CancellationToken>());
    }
}
