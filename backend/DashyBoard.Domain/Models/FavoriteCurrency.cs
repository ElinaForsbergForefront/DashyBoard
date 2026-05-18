namespace DashyBoard.Domain.Models;

public class FavoriteCurrency
{
    public Guid Id { get; private set; }
    public string UserId { get; private set; } = null!;
    public string Symbol { get; private set; } = null!;
    public DateTime AddedAt { get; private set; }

    private FavoriteCurrency() { }

    public FavoriteCurrency(string userId, string symbol)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("UserId cannot be empty.", nameof(userId));
        if (string.IsNullOrWhiteSpace(symbol))
            throw new ArgumentException("Symbol cannot be empty.", nameof(symbol));

        Id = Guid.NewGuid();
        UserId = userId;
        Symbol = symbol;
        AddedAt = DateTime.UtcNow;
    }
}

