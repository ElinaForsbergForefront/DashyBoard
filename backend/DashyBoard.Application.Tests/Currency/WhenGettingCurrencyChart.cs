using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using DashyBoard.Application.Utilities;
using FluentAssertions;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

public class WhenGettingCurrencyChart
{
    private readonly ICurrencyApiClient _currencyApiClient = Substitute.For<ICurrencyApiClient>();
    private readonly GetCurrencyChartQueryHandler _handler;

    public WhenGettingCurrencyChart()
    {
        _handler = new GetCurrencyChartQueryHandler(_currencyApiClient);
    }

    [Test]
    public async Task ShouldReturnChartData_WhenValidSymbolProvided()
    {
        // Arrange
        var startUtc = DateTime.Parse("2026-03-01T00:00:00Z").ToUniversalTime();
        var endUtc = DateTime.Parse("2026-03-30T00:00:00Z").ToUniversalTime();
        var symbol = "BTC-USD";

        var rawResult = CreateValidCurrencyResult(symbol);

        _currencyApiClient
            .GetCurrencyChartAsync(
                symbol,
                UnixTimestampConverter.ToUnixTimestamp(startUtc),
                UnixTimestampConverter.ToUnixTimestamp(endUtc),
                "1d",
                Arg.Any<CancellationToken>())
            .Returns(rawResult);

        // Act
        var result = await _handler.Handle(
            new GetCurrencyChartQuery(symbol, startUtc, endUtc, "1d"),
            CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Symbol.Should().Be("BTC-USD");
        result.Currency.Should().Be("USD");
        result.AssetName.Should().Be("Bitcoin USD");
        result.PriceHistory.Should().HaveCount(3);
        result.PriceHistory[0].Open.Should().Be(50000.0);
        result.PriceHistory[0].Close.Should().Be(51000.0);
    }

    [Test]
    public async Task ShouldCallApiClient_WithCorrectTimestamps()
    {
        // Arrange
        var startUtc = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc);
        var endUtc = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc);
        var symbol = "ETH-USD";

        var expectedStartTimestamp = UnixTimestampConverter.ToUnixTimestamp(startUtc);
        var expectedEndTimestamp = UnixTimestampConverter.ToUnixTimestamp(endUtc);

        var rawResult = CreateValidCurrencyResult(symbol);
        _currencyApiClient
            .GetCurrencyChartAsync(
                Arg.Any<string>(),
                Arg.Any<long>(),
                Arg.Any<long>(),
                Arg.Any<string>(),
                Arg.Any<CancellationToken>())
            .Returns(rawResult);

        // Act
        await _handler.Handle(
            new GetCurrencyChartQuery(symbol, startUtc, endUtc, "1h"),
            CancellationToken.None);

        // Assert
        await _currencyApiClient
            .Received(1)
            .GetCurrencyChartAsync(
                "ETH-USD",
                expectedStartTimestamp,
                expectedEndTimestamp,
                "1h",
                Arg.Any<CancellationToken>());
    }

    [Test]
    public void ShouldThrowArgumentException_WhenStartDateNotUtc()
    {
        // Arrange
        var startLocal = DateTime.Parse("2026-03-01T00:00:00"); // Local time
        var endUtc = DateTime.Parse("2026-03-30T00:00:00Z").ToUniversalTime();

        // Act
        var act = async () => await _handler.Handle(
            new GetCurrencyChartQuery("BTC-USD", startLocal, endUtc),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*must be UTC*");
    }

    [Test]
    public void ShouldThrowArgumentException_WhenEndDateNotUtc()
    {
        // Arrange
        var startUtc = DateTime.Parse("2026-03-01T00:00:00Z").ToUniversalTime();
        var endLocal = DateTime.Parse("2026-03-30T00:00:00"); // Local time

        // Act
        var act = async () => await _handler.Handle(
            new GetCurrencyChartQuery("BTC-USD", startUtc, endLocal),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*must be UTC*");
    }

    [Test]
    public void ShouldThrowArgumentException_WhenStartDateAfterEndDate()
    {
        // Arrange
        var startUtc = DateTime.Parse("2026-03-30T00:00:00Z").ToUniversalTime();
        var endUtc = DateTime.Parse("2026-03-01T00:00:00Z").ToUniversalTime();

        // Act
        var act = async () => await _handler.Handle(
            new GetCurrencyChartQuery("BTC-USD", startUtc, endUtc),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Start date must be before end date*");
    }

    [Test]
    public void ShouldThrowArgumentException_WhenStartDateEqualsEndDate()
    {
        // Arrange
        var dateUtc = DateTime.Parse("2026-03-15T00:00:00Z").ToUniversalTime();

        // Act
        var act = async () => await _handler.Handle(
            new GetCurrencyChartQuery("BTC-USD", dateUtc, dateUtc),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Start date must be before end date*");
    }

    [Test]
    public void ShouldPropagateInvalidOperationException_WhenNoDataFound()
    {
        // Arrange
        var startUtc = DateTime.Parse("2026-03-01T00:00:00Z").ToUniversalTime();
        var endUtc = DateTime.Parse("2026-03-30T00:00:00Z").ToUniversalTime();

        _currencyApiClient
            .GetCurrencyChartAsync(
                Arg.Any<string>(),
                Arg.Any<long>(),
                Arg.Any<long>(),
                Arg.Any<string>(),
                Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("No data found for symbol 'INVALID'."));

        // Act
        var act = async () => await _handler.Handle(
            new GetCurrencyChartQuery("INVALID", startUtc, endUtc),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*No data found*");
    }

    [TestCase("1m")]
    [TestCase("5m")]
    [TestCase("15m")]
    [TestCase("1h")]
    [TestCase("1d")]
    [TestCase("1wk")]
    [TestCase("1mo")]
    public async Task ShouldAcceptVariousIntervals(string interval)
    {
        // Arrange
        var startUtc = DateTime.Parse("2026-03-01T00:00:00Z").ToUniversalTime();
        var endUtc = DateTime.Parse("2026-03-30T00:00:00Z").ToUniversalTime();
        var symbol = "BTC-USD";

        var rawResult = CreateValidCurrencyResult(symbol);
        _currencyApiClient
            .GetCurrencyChartAsync(
                Arg.Any<string>(),
                Arg.Any<long>(),
                Arg.Any<long>(),
                interval,
                Arg.Any<CancellationToken>())
            .Returns(rawResult);

        // Act
        var result = await _handler.Handle(
            new GetCurrencyChartQuery(symbol, startUtc, endUtc, interval),
            CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        await _currencyApiClient
            .Received(1)
            .GetCurrencyChartAsync(symbol, Arg.Any<long>(), Arg.Any<long>(), interval, Arg.Any<CancellationToken>());
    }

    private static CurrencyResultDto CreateValidCurrencyResult(string symbol)
    {
        return new CurrencyResultDto(
            Meta: new CurrencyMetaDto(
                Currency: "USD",
                Symbol: symbol,
                InstrumentType: "CRYPTOCURRENCY",
                LongName: "Bitcoin USD",
                TimeZone: "UTC"
            ),
            Timestamp:
            [
                1709251200,
                1709337600,
                1709424000
            ],
            Indicators: new CurrencyIndicatorsDto(
                Quote:
                [
                    new CurrencyQuoteDto(
                        Open: [50000.0, 51000.0, 52000.0],
                        Close: [51000.0, 52000.0, 53000.0],
                        Low: [49500.0, 50500.0, 51500.0],
                        High: [51500.0, 52500.0, 53500.0]
                    )
                ]
            )
        );
    }
}