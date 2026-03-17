using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetArrivals;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Traffic;

public class WhenGettingArrivalsAtSpecificTimeFromTrafficApi
{
    private readonly ITrafficApiClient _trafficApiClient = Substitute.For<ITrafficApiClient>();
    private readonly GetArrivalsSpecificTimeQueryHandler _handler;

    public WhenGettingArrivalsAtSpecificTimeFromTrafficApi()
    {
        _handler = new GetArrivalsSpecificTimeQueryHandler(_trafficApiClient);
    }

    [Test]
    public async Task ShouldReturnArrivals_WhenStationAndTimeMatch()
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
                Direction: "Lund C via Universitetssjukhuset",
                TransportMode: "TRAM",
                Platform: "D"
            )
        };
        _trafficApiClient
            .GetArrivalsSpecificTimeAsync("740009236", "2026-03-04T10:00:00", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GetArrivalsSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result[0].Line.Should().Be("1");
        result[0].TransportMode.Should().Be("TRAM");
    }

    [Test]
    public async Task ShouldReturnEmptyList_WhenNoArrivalsAtTime()
    {
        // Arrange
        _trafficApiClient
            .GetArrivalsSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        var result = await _handler.Handle(
            new GetArrivalsSpecificTimeQuery("740009236", "2026-03-04T03:00:00"),
            CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldCallApiWithCorrectSiteIdAndDateTime()
    {
        // Arrange
        _trafficApiClient
            .GetArrivalsSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        await _handler.Handle(
            new GetArrivalsSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        await _trafficApiClient
            .Received(1)
            .GetArrivalsSpecificTimeAsync("740009236", "2026-03-04T10:00:00", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ShouldHandleCanceledArrivalAtSpecificTime()
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
                Direction: "Malmö C",
                TransportMode: "BUS",
                Platform: "A"
            )
        };
        _trafficApiClient
            .GetArrivalsSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GetArrivalsSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        result[0].Canceled.Should().BeTrue();
        result[0].Realtime.Should().BeNull();
    }

    [Test]
    public async Task ShouldHandleDelayedArrivalAtSpecificTime()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T10:00:00"),
                Realtime: DateTime.Parse("2026-03-04T10:07:00"),
                Delay: 420,
                Canceled: false,
                Line: "1",
                Direction: "Lund C via Universitetssjukhuset",
                TransportMode: "TRAM",
                Platform: "D"
            )
        };
        _trafficApiClient
            .GetArrivalsSpecificTimeAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GetArrivalsSpecificTimeQuery("740009236", "2026-03-04T10:00:00"),
            CancellationToken.None);

        // Assert
        result[0].Delay.Should().Be(420);
        result[0].Realtime.Should().BeAfter(result[0].Scheduled);
    }
}
