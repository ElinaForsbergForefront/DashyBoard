namespace DashyBoard.Application.Queries.Mirror.Dto;

public sealed record MirrorDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public double WidthCm { get; set; }
    public double HeightCm { get; set; }
    public DateTime CreatedAt { get; set; }
}
