namespace DashyBoard.Application.Queries.Mirror.Dto;

public sealed record MirrorDto
{
    public Guid Id { get; set; }
    public string UserSub { get; set; } = null!;
    public string Name { get; set; } = null!;
    public double WidthCm { get; set; }
    public double HeightCm { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<WidgetDto> Widgets { get; set; } = new();
}

public sealed class WidgetDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
}