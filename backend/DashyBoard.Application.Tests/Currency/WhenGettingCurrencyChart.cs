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
    private ICurrencyApiClient _currencyApiClient;
    private GetCurrencyChartQueryHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _currencyApiClient = Substitute.For<ICurrencyApiClient>();
        _handler = new GetCurrencyChartQueryHandler(_currencyApiClient);
    }

    [Test]
    public async Task Then_Returns_ChartData_With_ValidSymbol()
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
        result.PriceHistory.Should().HaveCount(3);
        result.PriceHistory[0].Open.Should().Be(50000.0);
    }

    [Test]
    public async Task Then_Calls_ApiClient_With_Correct_Timestamps()
    {
        // Arrange
        var startUtc = new DateTime(2026, 3, 1, 0, 0, 0, DateTimeKind.Utc);
        var endUtc = new DateTime(2026, 3, 30, 0, 0, 0, DateTimeKind.Utc);
        var symbol = "ETH-USD";

        var expectedStartTimestamp = UnixTimestampConverter.ToUnixTimestamp(startUtc);
        var expectedEndTimestamp = UnixTimestampConverter.ToUnixTimestamp(endUtc);

        var rawResult = CreateValidCurrencyResult(symbol);
        _currencyApiClient
            .GetCurrencyChartAsync(Arg.Any<string>(), Arg.Any<long>(), Arg.Any<long>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(rawResult);

        // Act
        await _handler.Handle(
            new GetCurrencyChartQuery(symbol, startUtc, endUtc, "1h"),
            CancellationToken.None);

        // Assert
        await _currencyApiClient
            .Received(1)
            .GetCurrencyChartAsync(symbol, expectedStartTimestamp, expectedEndTimestamp, "1h", Arg.Any<CancellationToken>());
    }

    [Test]
    public void Then_Throws_When_InvalidOperationException_From_Api()
    {
        // Arrange
        var startUtc = DateTime.Parse("2026-03-01T00:00:00Z").ToUniversalTime();
        var endUtc = DateTime.Parse("2026-03-30T00:00:00Z").ToUniversalTime();

        _currencyApiClient
            .GetCurrencyChartAsync(Arg.Any<string>(), Arg.Any<long>(), Arg.Any<long>(), Arg.Any<string>(), Arg.Any<CancellationToken>())
            .ThrowsAsync(new InvalidOperationException("No data found for symbol 'INVALID'."));

        // Act
        var act = async () => await _handler.Handle(
            new GetCurrencyChartQuery("INVALID", startUtc, endUtc),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*No data found*");
    }

    private static CurrencyResultDto CreateValidCurrencyResult(string symbol)
    {
        return new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", symbol, "CRYPTOCURRENCY", "Bitcoin USD", "UTC"),
            Timestamp: [1709251200, 1709337600, 1709424000],
            Indicators: new CurrencyIndicatorsDto(
                Quote: [
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