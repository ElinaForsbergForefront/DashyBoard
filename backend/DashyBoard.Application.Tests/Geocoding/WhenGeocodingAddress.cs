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

    [Test]
    public async Task Then_Returns_Coordinates_When_Swedish_City_Is_Valid()
    {
        // Arrange
        var expected = new GeocodeResponseDto(
            Latitude: 59.3293,
            Longitude: 18.0686,
            FormattedAddress: "Stockholm, Stockholms kommun, Stockholms län, Sverige"
        );

        _geocodingApiClient
            .GeocodeAddressAsync("Stockholm", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery("Stockholm"),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.Latitude.Should().Be(59.3293);
        result.Longitude.Should().Be(18.0686);
        result.FormattedAddress.Should().Contain("Stockholm");
    }

    [Test]
    public async Task Then_Returns_Coordinates_For_Gothenburg()
    {
        // Arrange
        var expected = new GeocodeResponseDto(
            Latitude: 57.7089,
            Longitude: 11.9746,
            FormattedAddress: "Göteborg, Göteborgs kommun, Västra Götalands län, Sverige"
        );

        _geocodingApiClient
            .GeocodeAddressAsync("Göteborg", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery("Göteborg"),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.Latitude.Should().Be(57.7089);
        result.Longitude.Should().Be(11.9746);
        result.FormattedAddress.Should().Contain("Göteborg");
    }

    [Test]
    public async Task Then_Returns_Coordinates_For_Malmo()
    {
        // Arrange
        var expected = new GeocodeResponseDto(
            Latitude: 55.6050,
            Longitude: 13.0038,
            FormattedAddress: "Malmö, Malmö kommun, Skåne län, Sverige"
        );

        _geocodingApiClient
            .GeocodeAddressAsync("Malmö", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery("Malmö"),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.Latitude.Should().Be(55.6050);
        result.Longitude.Should().Be(13.0038);
        result.FormattedAddress.Should().Contain("Malmö");
    }

    [Test]
    public async Task Then_Returns_Coordinates_When_Swedish_Street_Address_Is_Valid()
    {
        // Arrange
        var expected = new GeocodeResponseDto(
            Latitude: 59.3297,
            Longitude: 18.0640,
            FormattedAddress: "Drottninggatan, Norrmalm, Stockholm, Stockholms kommun, Stockholms län, 111 51, Sverige"
        );

        _geocodingApiClient
            .GeocodeAddressAsync("Drottninggatan, Stockholm", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery("Drottninggatan, Stockholm"),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.Latitude.Should().Be(59.3297);
        result.Longitude.Should().Be(18.0640);
        result.FormattedAddress.Should().Contain("Drottninggatan");
    }

    [Test]
    public async Task Then_Returns_Coordinates_For_Lund_University()
    {
        // Arrange
        var expected = new GeocodeResponseDto(
            Latitude: 55.7104,
            Longitude: 13.2091,
            FormattedAddress: "Lunds universitet, Paradisgatan, Lund, Lunds kommun, Skåne län, 223 50, Sverige"
        );

        _geocodingApiClient
            .GeocodeAddressAsync("Lunds universitet", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery("Lunds universitet"),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.Latitude.Should().Be(55.7104);
        result.Longitude.Should().Be(13.2091);
        result.FormattedAddress.Should().Contain("Lunds universitet");
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
    public async Task Then_Handles_Swedish_Characters_In_Address()
    {
        // Arrange
        var expected = new GeocodeResponseDto(
            Latitude: 59.8586,
            Longitude: 17.6389,
            FormattedAddress: "Uppsala, Uppsala kommun, Uppsala län, Sverige"
        );

        _geocodingApiClient
            .GeocodeAddressAsync("Uppsala, Sveavägen", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new GeocodeAddressQuery("Uppsala, Sveavägen"),
            CancellationToken.None
        );

        // Assert
        result.Should().NotBeNull();
        result.FormattedAddress.Should().Contain("Uppsala");
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