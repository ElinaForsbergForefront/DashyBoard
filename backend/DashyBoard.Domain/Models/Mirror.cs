namespace DashyBoard.Domain.Models;
public class Mirror
{
    public Guid Id { get; private set; }
    public string UserSub { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public double WidthCm { get; private set; }
    public double HeightCm { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public List<Widget> Widgets { get; private set; } = new();

    private Mirror() { }

    public Mirror(string userSub, string name, double widthCm, double heightCm)
    {
        Id = Guid.NewGuid();
        UserSub = userSub;
        Name = name;
        WidthCm = widthCm;
        HeightCm = heightCm;
        CreatedAt = DateTime.UtcNow;
    }

    public void Update(string name, double widthCm, double heightCm)
    {
        Name = name;
        WidthCm = widthCm;
        HeightCm = heightCm;
    }

    public void AddWidget(string type, double x, double y)
    {
        Widgets.Add(new Widget(type, x, y));
    }

    public void RemoveWidget(Guid widgetId)
    {
        var widget = Widgets.FirstOrDefault(w => w.Id == widgetId);

        if (widget is null)
            throw new KeyNotFoundException($"Widget with id {widgetId} not found.");

        Widgets.Remove(widget);
    }

    public void MoveWidget(Guid widgetId, double x, double y)
    {
        var widget = Widgets.FirstOrDefault(w => w.Id == widgetId);

        if (widget is null)
            throw new KeyNotFoundException($"Widget with id {widgetId} not found.");

        widget.Move(x, y);
    }
}