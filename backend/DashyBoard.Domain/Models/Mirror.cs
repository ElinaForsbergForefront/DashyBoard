namespace DashyBoard.Domain.Models;
public class Mirror
{
    public Guid Id { get; private set; }
    public string UserSub { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public double WidthCm { get; private set; }
    public double HeightCm { get; private set; }
    public DateTime CreatedAt { get; private set; }

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
}