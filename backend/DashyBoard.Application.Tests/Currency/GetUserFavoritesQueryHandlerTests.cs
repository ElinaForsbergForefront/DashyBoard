using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency;
using DashyBoard.Application.Queries.Currency.Dto;
using Moq;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Currency;

[TestFixture]
public class GetUserFavoritesQueryHandlerTests
{
    private Mock<IFavoriteCurrencyRepository> _repositoryMock = null!;
    private GetUserFavoritesQueryHandler _handler = null!;

    [SetUp]
    public void Setup()
    {
        _repositoryMock = new Mock<IFavoriteCurrencyRepository>();
        _handler = new GetUserFavoritesQueryHandler(_repositoryMock.Object);
    }

    [Test]
    public async Task Handle_ReturnsUserFavoritesFromRepository()
    {
        var userId = Guid.NewGuid();
        var expectedFavorites = new List<FavoriteCurrencyDto>
        {
            new("AAPL", DateTime.UtcNow),
            new("MSFT", DateTime.UtcNow.AddMinutes(-5))
        };

        _repositoryMock
            .Setup(r => r.GetUserFavoritesAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedFavorites);

        var query = new GetUserFavoritesQuery(userId);

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result.Count, Is.EqualTo(2));
        Assert.That(result[0].Symbol, Is.EqualTo("AAPL"));
        Assert.That(result[1].Symbol, Is.EqualTo("MSFT"));
    }

    [Test]
    public async Task Handle_WhenUserHasNoFavorites_ReturnsEmptyList()
    {
        var userId = Guid.NewGuid();
        var expectedFavorites = new List<FavoriteCurrencyDto>();

        _repositoryMock
            .Setup(r => r.GetUserFavoritesAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedFavorites);

        var query = new GetUserFavoritesQuery(userId);

        var result = await _handler.Handle(query, CancellationToken.None);

        Assert.That(result.Count, Is.EqualTo(0));
    }
}