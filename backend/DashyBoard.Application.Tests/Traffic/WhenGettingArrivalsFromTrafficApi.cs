using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetArrivals;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Traffic;

public class WhenGettingArrivalsFromTrafficApi
{
    private readonly ITrafficApiClient _trafficApiClient = Substitute.For<ITrafficApiClient>();
    private readonly GetArrivalsQueryHandler _handler;

    public WhenGettingArrivalsFromTrafficApi()
    {
        _handler = new GetArrivalsQueryHandler(_trafficApiClient);
    }

    [Test]
    public async Task ShouldReturnArrivals_WhenStationExists()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T07:54:08"),
                Realtime: DateTime.Parse("2026-03-04T07:54:08"),
                Delay: 0,
                Canceled: false,
                Line: "1",
                Direction: "Lund C via Universitetssjukhuset",
                TransportMode: "TRAM",
                Platform: "D"
            )
        };
        _trafficApiClient
            .GetArrivalsAsync("740009236", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(new GetArrivalsQuery("740009236"), CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result[0].Line.Should().Be("1");
        result[0].TransportMode.Should().Be("TRAM");
        result[0].Delay.Should().Be(0);
    }

    [Test]
    public async Task ShouldReturnEmptyList_WhenNoArrivals()
    {
        // Arrange
        _trafficApiClient
            .GetArrivalsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        var result = await _handler.Handle(new GetArrivalsQuery("740009236"), CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldCallApiWithCorrectSiteId()
    {
        // Arrange
        _trafficApiClient
            .GetArrivalsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        await _handler.Handle(new GetArrivalsQuery("740009236"), CancellationToken.None);

        // Assert
        await _trafficApiClient
            .Received(1)
            .GetArrivalsAsync("740009236", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ShouldHandleCanceledArrival()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T07:54:08"),
                Realtime: null,
                Delay: 0,
                Canceled: true,
                Line: "1",
                Direction: "Lund C via Universitetssjukhuset",
                TransportMode: "TRAM",
                Platform: "D"
            )
        };
        _trafficApiClient
            .GetArrivalsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(new GetArrivalsQuery("740009236"), CancellationToken.None);

        // Assert
        result[0].Canceled.Should().BeTrue();
        result[0].Realtime.Should().BeNull();
    }

    [Test]
    public async Task ShouldHandleDelayedArrival()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T07:54:08"),
                Realtime: DateTime.Parse("2026-03-04T08:01:08"),
                Delay: 420,
                Canceled: false,
                Line: "166",
                Direction: "Malmö C",
                TransportMode: "BUS",
                Platform: "A"
            )
        };
        _trafficApiClient
            .GetArrivalsAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(new GetArrivalsQuery("740009236"), CancellationToken.None);

        // Assert
        result[0].Delay.Should().Be(420);
        result[0].Realtime.Should().BeAfter(result[0].Scheduled);
    }

}
