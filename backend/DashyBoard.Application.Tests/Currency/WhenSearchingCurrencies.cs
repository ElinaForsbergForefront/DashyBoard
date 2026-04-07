using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

public class WhenSearchingCurrencies
{
    private ICurrencyApiClient _currencyApiClient;
    private SearchCurrenciesQueryHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _currencyApiClient = Substitute.For<ICurrencyApiClient>();
        _handler = new SearchCurrenciesQueryHandler(_currencyApiClient);
    }

    [Test]
    public async Task Then_Returns_SearchResults_With_ValidQuery()
    {
        // Arrange
        var expected = new CurrencySearchDto(
            Count: 2,
            Quotes:
            [
                new CurrencySearchQuoteDto(
                    Symbol: "BTC-USD",
                    ShortName: "Bitcoin USD",
                    QuoteType: "CRYPTOCURRENCY",
                    Exchange: "CCC",
                    LogoUrl: "https://example.com/btc.png"
                ),
                new CurrencySearchQuoteDto(
                    Symbol: "BTC-EUR",
                    ShortName: "Bitcoin EUR",
                    QuoteType: "CRYPTOCURRENCY",
                    Exchange: "CCC",
                    LogoUrl: "https://example.com/btc-eur.png"
                )
            ]
        );

        _currencyApiClient
            .SearchCurrenciesAsync("BTC", Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new SearchCurrenciesQuery("BTC"),
            CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Count.Should().Be(2);
        result.Quotes.Should().HaveCount(2);
        result.Quotes[0].Symbol.Should().Be("BTC-USD");
    }

    [Test]
    public async Task Then_Calls_ApiClient_With_CorrectQuery()
    {
        // Arrange
        var expected = new CurrencySearchDto(0, []);
        _currencyApiClient
            .SearchCurrenciesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        await _handler.Handle(
            new SearchCurrenciesQuery("Ethereum"),
            CancellationToken.None);

        // Assert
        await _currencyApiClient
            .Received(1)
            .SearchCurrenciesAsync("Ethereum", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task Then_Returns_EmptyResults_When_NoMatches()
    {
        // Arrange
        var expected = new CurrencySearchDto(0, []);
        _currencyApiClient
            .SearchCurrenciesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new SearchCurrenciesQuery("NONEXISTENT"),
            CancellationToken.None);

        // Assert
        result.Count.Should().Be(0);
        result.Quotes.Should().BeEmpty();
    }
}