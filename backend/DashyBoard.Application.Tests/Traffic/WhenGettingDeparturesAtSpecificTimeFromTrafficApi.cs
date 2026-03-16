using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetDepartures;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Traffic;

public class WhenGettingDeparturesAtSpecificTimeFromTrafficApi
{
    private readonly ITrafficApiClient _trafficApiClient = Substitute.For<ITrafficApiClient>();
    private readonly GetDeparturesSpecificTimeQueryHandler _handler;

    public WhenGettingDeparturesAtSpecificTimeFromTrafficApi()
    {
        _handler = new GetDeparturesSpecificTimeQueryHandler(_trafficApiClient);
    }

    [Test]
    public async Task ShouldReturnDepartures_WhenStationAndTimeMatch()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T10:00:00"),
                Realtime: DateTime.Parse("2026-03-04T10:00:00"),
                Delay: 0,
                Canceled: false,
                Line: "1",
                Direction: "Lund C",
                TransportMode: "TRAM",
                Platform: "D"
            )
        };
        _trafficApiClient
            .GetDeparturesSpecificTimeAsync("740009236", "2026-03-04T10:00:00", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GetDeparturesSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result[0].Line.Should().Be("1");
        result[0].TransportMode.Should().Be("TRAM");
    }

    [Test]
    public async Task ShouldReturnEmptyList_WhenNoDeparturesAtTime()
    {
        // Arrange
        _trafficApiClient
            .GetDeparturesSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        var result = await _handler.Handle(
            new GetDeparturesSpecificTimeQuery("740009236", "2026-03-04T03:00:00"),
            CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldCallApiWithCorrectSiteIdAndDateTime()
    {
        // Arrange
        _trafficApiClient
            .GetDeparturesSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        await _handler.Handle(
            new GetDeparturesSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        await _trafficApiClient
            .Received(1)
            .GetDeparturesSpecificTimeAsync("740009236", "2026-03-04T10:00:00", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ShouldHandleCanceledDepartureAtSpecificTime()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T10:00:00"),
                Realtime: null,
                Delay: 0,
                Canceled: true,
                Line: "166",
                Direction: "S Sandby",
                TransportMode: "BUS",
                Platform: "A"
            )
        };
        _trafficApiClient
            .GetDeparturesSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GetDeparturesSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        result[0].Canceled.Should().BeTrue();
        result[0].Realtime.Should().BeNull();
    }
}
