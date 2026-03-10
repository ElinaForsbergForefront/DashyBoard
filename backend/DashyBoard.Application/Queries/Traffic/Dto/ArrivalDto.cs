namespace DashyBoard.Application.Queries.Traffic.Dto;

/// <summary>A single arrival row shown in the timetable widget.</summary>
public record ArrivalDto(
    DateTime Scheduled,
    DateTime? Realtime,
    int Delay,
    bool Canceled,
    string Line,
    string Direction,
    string TransportMode,
    string Platform
);
