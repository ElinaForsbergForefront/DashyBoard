using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Geocoding;
using DashyBoard.Application.Queries.Geocoding.Dto;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Geocoding;

public class WhenGeocodingAddress
{
    private readonly IGeocodingApiClient _geocodingApiClient = Substitute.For<IGeocodingApiClient>();
    private readonly GeocodeAddressQueryHandler _handler;

    public WhenGeocodingAddress()
    {
        _handler = new GeocodeAddressQueryHandler(_geocodingApiClient);
    }

    [TestCase("Stockholm", 59.3293, 18.0686, "Stockholm, Stockholms kommun, Stockholms län, Sverige")]
    [TestCase("Göteborg", 57.7089, 11.9746, "Göteborg, Göteborgs kommun, Västra Götalands län, Sverige")]
    [TestCase("Malmö", 55.6050, 13.0038, "Malmö, Malmö kommun, Skåne län, Sverige")]
    [TestCase("Lunds universitet", 55.7104, 13.2091, "Lunds universitet, Paradisgatan, Lund, Lunds kommun, Skåne län, 223 50, Sverige")]
    [TestCase("Drottninggatan, Stockholm", 59.3297, 18.0640, "Drottninggatan, Norrmalm, Stockholm, Stockholms kommun, Stockholms län, 111 51, Sverige")]
    [TestCase("Uppsala, Sveavägen", 59.8586, 17.6389, "Uppsala, Uppsala kommun, Uppsala län, Sverige")]
    public async Task Then_Returns_Correct_Coordinates_For_Address(
        string address,
        double expectedLat,
        double expectedLon,
        string expectedFormatted)
    {
        // Arrange
        var expected = new GeocodeResponseDto(expectedLat, expectedLon, expectedFormatted);

        _geocodingApiClient
            .GeocodeAddressAsync(address, Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery(address),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.Latitude.Should().Be(expectedLat);
        result.Longitude.Should().Be(expectedLon);
        result.FormattedAddress.Should().Be(expectedFormatted);
    }

    [Test]
    public async Task Then_Calls_ApiClient_With_Correct_Address()
    {
        // Arrange
        var expected = new GeocodeResponseDto(59.3293, 18.0686, "Stockholm, Sverige");
        _geocodingApiClient
            .GeocodeAddressAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        await _handler.Handle(
            new GeocodeAddressQuery("Stockholm"),
            CancellationToken.None
        );

        // Assert
        await _geocodingApiClient
            .Received(1)
            .GeocodeAddressAsync("Stockholm", Arg.Any<CancellationToken>());
    }

    [Test]
    public void Then_Throws_When_ApiClient_Throws_InvalidOperationException()
    {
        // Arrange
        _geocodingApiClient
            .GeocodeAddressAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromException<GeocodeResponseDto>(
                new InvalidOperationException("Address could not be geocoded.")
            ));

        // Act & Assert
        var act = async () => await _handler.Handle(
            new GeocodeAddressQuery("OgiltigAdress123"),
            CancellationToken.None
        );

        act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*could not be geocoded*");
    }

    [Test]
    public void Then_Throws_When_ApiClient_Throws_ArgumentException()
    {
        // Arrange
        _geocodingApiClient
            .GeocodeAddressAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(Task.FromException<GeocodeResponseDto>(
                new ArgumentException("Address cannot be empty.")
            ));

        // Act & Assert
        var act = async () => await _handler.Handle(
            new GeocodeAddressQuery(""),
            CancellationToken.None
        );

        act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*cannot be empty*");
    }
}