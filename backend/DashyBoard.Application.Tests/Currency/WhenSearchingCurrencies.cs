using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using FluentAssertions;
using NSubstitute;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

public class WhenSearchingCurrencies
{
    private readonly ICurrencyApiClient _currencyApiClient = Substitute.For<ICurrencyApiClient>();
    private readonly SearchCurrenciesQueryHandler _handler;

    public WhenSearchingCurrencies()
    {
        _handler = new SearchCurrenciesQueryHandler(_currencyApiClient);
    }

    [TestCase("BTC")]
    [TestCase("Bitcoin")]
    [TestCase("AAPL")]
    [TestCase("Tesla")]
    public async Task ShouldReturnSearchResults_WhenValidQueryProvided(string query)
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
            .SearchCurrenciesAsync(query, Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new SearchCurrenciesQuery(query),
            CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Count.Should().Be(2);
        result.Quotes.Should().HaveCount(2);
        result.Quotes[0].Symbol.Should().Be("BTC-USD");
        result.Quotes[1].Symbol.Should().Be("BTC-EUR");
    }

    [Test]
    public async Task ShouldCallApiClient_WithCorrectQuery()
    {
        // Arrange
        var query = "Ethereum";
        var expected = new CurrencySearchDto(0, []);

        _currencyApiClient
            .SearchCurrenciesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        await _handler.Handle(
            new SearchCurrenciesQuery(query),
            CancellationToken.None);

        // Assert
        await _currencyApiClient
            .Received(1)
            .SearchCurrenciesAsync("Ethereum", Arg.Any<CancellationToken>());
    }

    [Test]
    public async Task ShouldReturnEmptyResults_WhenNoMatchesFound()
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
        result.Should().NotBeNull();
        result.Count.Should().Be(0);
        result.Quotes.Should().BeEmpty();
    }

    [TestCase("")]
    [TestCase(" ")]
    [TestCase("   ")]
    public void ShouldThrowArgumentException_WhenQueryIsEmptyOrWhitespace(string query)
    {
        // Act
        var act = async () => await _handler.Handle(
            new SearchCurrenciesQuery(query),
            CancellationToken.None);

        // Assert
        act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*cannot be empty*");
    }

    [Test]
    public async Task ShouldHandleResultsWithNullLogoUrl()
    {
        // Arrange
        var expected = new CurrencySearchDto(
            Count: 1,
            Quotes:
            [
                new CurrencySearchQuoteDto(
                    Symbol: "XYZ",
                    ShortName: "Test Coin",
                    QuoteType: "CRYPTOCURRENCY",
                    Exchange: null,
                    LogoUrl: null
                )
            ]
        );

        _currencyApiClient
            .SearchCurrenciesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new SearchCurrenciesQuery("Test"),
            CancellationToken.None);

        // Assert
        result.Quotes[0].LogoUrl.Should().BeNull();
        result.Quotes[0].Exchange.Should().BeNull();
    }

    [Test]
    public async Task ShouldHandleDifferentQuoteTypes()
    {
        // Arrange
        var expected = new CurrencySearchDto(
            Count: 3,
            Quotes:
            [
                new CurrencySearchQuoteDto("BTC-USD", "Bitcoin", "CRYPTOCURRENCY", "CCC", null),
                new CurrencySearchQuoteDto("AAPL", "Apple Inc.", "EQUITY", "NASDAQ", null),
                new CurrencySearchQuoteDto("EURUSD=X", "EUR/USD", "CURRENCY", "CCY", null)
            ]
        );

        _currencyApiClient
            .SearchCurrenciesAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(expected);

        // Act
        var result = await _handler.Handle(
            new SearchCurrenciesQuery("mixed"),
            CancellationToken.None);

        // Assert
        result.Quotes.Should().Contain(q => q.QuoteType == "CRYPTOCURRENCY");
        result.Quotes.Should().Contain(q => q.QuoteType == "EQUITY");
        result.Quotes.Should().Contain(q => q.QuoteType == "CURRENCY");
    }
}