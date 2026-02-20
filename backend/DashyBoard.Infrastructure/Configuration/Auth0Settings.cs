namespace DashyBoard.Domain.Configuration;

public class Auth0Settings
{
    public const string SectionName = "Auth0";

    public string Domain { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
}
