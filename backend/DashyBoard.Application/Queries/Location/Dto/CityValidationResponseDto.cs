namespace DashyBoard.Application.Queries.Location.Dto;

public sealed record CityValidationResponseDto(
    bool IsValid,
    IReadOnlyList<CityDto> Results
);
