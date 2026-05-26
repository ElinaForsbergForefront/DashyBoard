using MongoDB.Bson.Serialization.Attributes;

namespace DashyBoard.Domain.Models;

public sealed class Widget
{
    public Guid Id { get; private set; }
    public string Type { get; private set; } = string.Empty;
    public double X { get; private set; }
    public double Y { get; private set; }
    public Dictionary<string, object?> Config { get; private set; } = new();

    [BsonConstructor]
    private Widget()
    {
        Config = new Dictionary<string, object?>();
    }

    public Widget(string type, double x, double y, Dictionary<string, object?>? config = null)
    {
        Id = Guid.NewGuid();
        Type = type;
        X = x;
        Y = y;
        Config = config ?? new Dictionary<string, object?>();
    }

    public void Move(double x, double y)
    {
        X = x;
        Y = y;
    }

    public void UpdateConfig(IReadOnlyDictionary<string, object?> config)
    {
        Config = new Dictionary<string, object?>(config);
    }
}