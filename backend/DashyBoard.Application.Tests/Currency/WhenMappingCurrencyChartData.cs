using DashyBoard.Application.Mappers.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using FluentAssertions;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

public class WhenMappingCurrencyChartData
{
    [Test]
    public void Then_Maps_ValidCurrencyResult_To_ChartData()
    {
        // Arrange
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", "BTC-USD", "CRYPTOCURRENCY", "Bitcoin USD", "America/New_York"),
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

        // Act
        var result = CurrencyChartMapper.ToCurrencyChartData(raw);

        // Assert
        result.Symbol.Should().Be("BTC-USD");
        result.Currency.Should().Be("USD");
        result.PriceHistory.Should().HaveCount(3);
        result.PriceHistory[0].Open.Should().Be(50000.0);
    }

    [Test]
    public void Then_Skips_Incomplete_DataPoints()
    {
        // Arrange
        var raw = new CurrencyResultDto(
            Meta: new CurrencyMetaDto("USD", "BTC-USD", "CRYPTOCURRENCY", "Bitcoin USD", "UTC"),
            Timestamp: [1709251200, 1709337600, 1709424000],
            Indicators: new CurrencyIndicatorsDto(
                Quote: [
                    new CurrencyQuoteDto(
                        Open: [50000.0, null, 52000.0],
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
        result.PriceHistory.Should().HaveCount(2);
        result.PriceHistory[0].Timestamp.Should().Be(1709251200);
        result.PriceHistory[1].Timestamp.Should().Be(1709424000);
    }

    [Test]
    public void Then_Throws_When_NoQuoteData()
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
}