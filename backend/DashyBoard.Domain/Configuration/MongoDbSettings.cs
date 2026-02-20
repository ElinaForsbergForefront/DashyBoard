namespace DashyBoard.Domain.Configuration;

public class MongoDbSettings
{
    public const string SectionName = "MongoDB";

    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
}
