using DashyBoard.Application.Commands.Currency;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency.Dto;
using Moq;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

[TestFixture]
public class AddFavoriteCurrencyCommandHandlerTests
{
    private Mock<IFavoriteCurrencyRepository> _repositoryMock = null!;
    private AddFavoriteCurrencyCommandHandler _handler = null!;

    [SetUp]
    public void Setup()
    {
        _repositoryMock = new Mock<IFavoriteCurrencyRepository>();
        _handler = new AddFavoriteCurrencyCommandHandler(_repositoryMock.Object);
    }

    [Test]
    public async Task Handle_WhenUserHasLessThanFiveFavorites_AddsFavorite()
    {
        var userId = "auth0|user123";
        var symbol = "AAPL";
        var expectedDto = new FavoriteCurrencyDto(symbol, DateTime.UtcNow);

        _repositoryMock
            .Setup(r => r.IsFavoritedAsync(userId, symbol, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _repositoryMock
            .Setup(r => r.GetFavoriteCountAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(2);

        _repositoryMock
            .Setup(r => r.AddFavoriteAsync(userId, symbol, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedDto);

        var command = new AddFavoriteCurrencyCommand(userId, symbol);

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.That(result.Symbol, Is.EqualTo(symbol));
        _repositoryMock.Verify(
            r => r.AddFavoriteAsync(userId, symbol, It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Test]
    public void Handle_WhenUserHasFiveFavorites_ThrowsInvalidOperationException()
    {
        var userId = "auth0|user123";
        var symbol = "AAPL";

        _repositoryMock
            .Setup(r => r.IsFavoritedAsync(userId, symbol, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        _repositoryMock
            .Setup(r => r.GetFavoriteCountAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(5);

        var command = new AddFavoriteCurrencyCommand(userId, symbol);

        var ex = Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));

        Assert.That(ex.Message, Does.Contain("maximum"));
    }

    [Test]
    public void Handle_WhenCurrencyAlreadyFavorited_ThrowsInvalidOperationException()
    {
        var userId = "auth0|user123";
        var symbol = "AAPL";

        _repositoryMock
            .Setup(r => r.IsFavoritedAsync(userId, symbol, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var command = new AddFavoriteCurrencyCommand(userId, symbol);

        var ex = Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));

        Assert.That(ex.Message, Does.Contain("already favorited"));
    }
}