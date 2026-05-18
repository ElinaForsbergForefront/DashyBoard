using DashyBoard.Domain.Models;
using NUnit.Framework;

namespace DashyBoard.Domain.Tests.Currency;

[TestFixture]
public class FavoriteCurrencyTests
{
    [Test]
    public void Constructor_WithValidData_CreatesInstance()
    {
        var userId = Guid.NewGuid();
        var symbol = "AAPL";

        var favorite = new FavoriteCurrency(userId, symbol);

        Assert.That(favorite.Id, Is.Not.EqualTo(Guid.Empty));
        Assert.That(favorite.UserId, Is.EqualTo(userId));
        Assert.That(favorite.Symbol, Is.EqualTo(symbol));
        Assert.That(favorite.AddedAt, Is.GreaterThan(DateTime.UtcNow.AddSeconds(-1)));
    }

    [Test]
    public void Constructor_WithEmptySymbol_ThrowsArgumentException()
    {
        var userId = Guid.NewGuid();

        var ex = Assert.Throws<ArgumentException>(() => new FavoriteCurrency(userId, ""));

        Assert.That(ex.Message, Does.Contain("Symbol cannot be empty"));
    }

    [Test]
    public void Constructor_WithNullSymbol_ThrowsArgumentException()
    {
        var userId = Guid.NewGuid();

        var ex = Assert.Throws<ArgumentException>(() => new FavoriteCurrency(userId, null!));

        Assert.That(ex.Message, Does.Contain("Symbol cannot be empty"));
    }
}