namespace DashyBoard.Application.Queries.Traffic.Dto;

/// <summary>A single departure row shown in the timetable widget.</summary>
public record DepartureDto(
    DateTime Scheduled,
    DateTime? Realtime,
    int Delay,
    bool Canceled,
    string Line,
    string Direction,
    string TransportMode,
    string Platform
);
