using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Traffic.Dto;
using DashyBoard.Application.Queries.Traffic.GetDepartures;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Traffic;

public class WhenGettingDeparturesFromTrafficApi
{
    private readonly ITrafficApiClient _trafficApiClient = Substitute.For<ITrafficApiClient>();
    private readonly GetDeparturesQueryHandler _handler;

    public WhenGettingDeparturesFromTrafficApi()
    {
        _handler = new GetDeparturesQueryHandler(_trafficApiClient);
    }

    [Test]
    public async Task ShouldReturnDepartures_WhenStationExists()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T07:48:10"),
                Realtime: DateTime.Parse("2026-03-04T07:51:07"),
                Delay: 177,
                Canceled: false,
                Line: "166",
                Direction: "S Sandby",
                TransportMode: "BUS",
                Platform: "A"
            )
        };
        _trafficApiClient
            .GetDeparturesAsync("740009236", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(new GetDeparturesQuery("740009236"), CancellationToken.None);

        // Assert
        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result[0].Line.Should().Be("166");
        result[0].Direction.Should().Be("S Sandby");
        result[0].TransportMode.Should().Be("BUS");
        result[0].Platform.Should().Be("A");
        result[0].Delay.Should().Be(177);
        result[0].Canceled.Should().BeFalse();
    }

    [Test]
    public async Task ShouldReturnEmptyList_WhenNoDepartures()
    {
        // Arrange
        _trafficApiClient
            .GetDeparturesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        var result = await _handler.Handle(new GetDeparturesQuery("740009236"), CancellationToken.None);

        // Assert
        result.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldCallApiWithCorrectSiteId()
    {
        // Arrange
        _trafficApiClient
            .GetDeparturesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns([]);

        // Act
        await _handler.Handle(new GetDeparturesQuery("740009236"), CancellationToken.None);

        // Assert
        await _trafficApiClient
            .Received(1)
            .GetDeparturesAsync("740009236", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ShouldHandleCanceledDeparture()
    {
        // Arrange
        var expected = new List<TimetableEntryDto>
        {
            new(
                Scheduled: DateTime.Parse("2026-03-04T07:48:10"),
                Realtime: null,
                Delay: 0,
                Canceled: true,
                Line: "1",
                Direction: "Lund C",
                TransportMode: "TRAM",
                Platform: "D"
            )
        };
        _trafficApiClient
            .GetDeparturesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(new GetDeparturesQuery("740009236"), CancellationToken.None);

        // Assert
        result[0].Canceled.Should().BeTrue();
        result[0].Realtime.Should().BeNull();
    }
}

