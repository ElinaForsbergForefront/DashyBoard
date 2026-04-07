namespace DashyBoard.Application.Queries.Location.Dto
{
    public sealed record CountryDto(
        string Code,
        string Name,
        string? FlagPngUrl,
        string? FlagEmoji
    );
}
