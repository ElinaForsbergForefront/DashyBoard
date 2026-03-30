using DashyBoard.Application.Mappers.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using FluentAssertions;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

public class WhenMappingCurrencyChartData
{
    [Test]
    public void ShouldMapValidCurrencyResult_ToChartData()
    {
        // Arrange
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto(
                Currency: "USD",
                Symbol: "BTC-USD",
                InstrumentType: "CRYPTOCURRENCY",
                LongName: "Bitcoin USD",
                TimeZone: "America/New_York"
            ),
            Timestamp: [1709251200, 1709337600, 1709424000],
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

        // Act
        var result = CurrencyChartMapper.ToCurrencyChartData(raw);

        // Assert
        result.Should().NotBeNull();
        result.Symbol.Should().Be("BTC-USD");
        result.Currency.Should().Be("USD");
        result.AssetName.Should().Be("Bitcoin USD");
        result.PriceHistory.Should().HaveCount(3);

        result.PriceHistory[0].Timestamp.Should().Be(1709251200);
        result.PriceHistory[0].Open.Should().Be(50000.0);
        result.PriceHistory[0].Close.Should().Be(51000.0);
        result.PriceHistory[0].Low.Should().Be(49500.0);
        result.PriceHistory[0].High.Should().Be(51500.0);
    }

    [Test]
    public void ShouldSkipIncompleteDataPoints()
    {
        // Arrange
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", "BTC-USD", "CRYPTOCURRENCY", "Bitcoin USD", "UTC"),
            Timestamp: [1709251200, 1709337600, 1709424000],
            Indicators: new CurrencyIndicatorsDto(
                Quote:
                [
                    new CurrencyQuoteDto(
                        Open: [50000.0, null, 52000.0],  // Second value is null
                        Close: [51000.0, 52000.0, 53000.0],
                        Low: [49500.0, 50500.0, 51500.0],
                        High: [51500.0, 52500.0, 53500.0]
                    )
                ]
            )
        );

        // Act
        var result = CurrencyChartMapper.ToCurrencyChartData(raw);

        // Assert
        result.PriceHistory.Should().HaveCount(2); // Only 2 complete data points
        result.PriceHistory[0].Timestamp.Should().Be(1709251200);
        result.PriceHistory[1].Timestamp.Should().Be(1709424000); // Skipped middle one
    }

    [Test]
    public void ShouldThrowInvalidOperationException_WhenNoQuoteData()
    {
        // Arrange
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", "BTC-USD", "CRYPTOCURRENCY", "Bitcoin USD", "UTC"),
            Timestamp: [1709251200],
            Indicators: new CurrencyIndicatorsDto(Quote: [])
        );

        // Act
        var act = () => CurrencyChartMapper.ToCurrencyChartData(raw);

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*No quote data*");
    }

    [Test]
    public void ShouldThrowArgumentNullException_WhenRawIsNull()
    {
        // Act
        var act = () => CurrencyChartMapper.ToCurrencyChartData(null!);

        // Assert
        act.Should().Throw<ArgumentNullException>();
    }

    [Test]
    public void ShouldHandleEmptyTimestampArray()
    {
        // Arrange
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", "BTC-USD", "CRYPTOCURRENCY", "Bitcoin USD", "UTC"),
            Timestamp: [],
            Indicators: new CurrencyIndicatorsDto(
                Quote:
                [
                    new CurrencyQuoteDto(
                        Open: [],
                        Close: [],
                        Low: [],
                        High: []
                    )
                ]
            )
        );

        // Act
        var result = CurrencyChartMapper.ToCurrencyChartData(raw);

        // Assert
        result.PriceHistory.Should().BeEmpty();
    }

    [Test]
    public void ShouldHandleMixedNullValues()
    {
        // Arrange - Only first and third data points are complete
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", "ETH-USD", "CRYPTOCURRENCY", "Ethereum USD", "UTC"),
            Timestamp: [1709251200, 1709337600, 1709424000, 1709510400],
            Indicators: new CurrencyIndicatorsDto(
                Quote:
                [
                    new CurrencyQuoteDto(
                        Open: [3000.0, null, 3100.0, 3200.0],
                        Close: [3050.0, 3150.0, null, 3250.0],
                        Low: [2980.0, 3080.0, 3080.0, null],
                        High: [3080.0, null, 3180.0, 3280.0]
                    )
                ]
            )
        );

        // Act
        var result = CurrencyChartMapper.ToCurrencyChartData(raw);

        // Assert
        result.PriceHistory.Should().HaveCount(1); // Only the first point is complete
        result.PriceHistory[0].Timestamp.Should().Be(1709251200);
    }
}