namespace DashyBoard.Application.Queries.Traffic.Dto;

/// <summary>A single timetable row (departure or arrival) shown in the timetable widget.</summary>
public sealed record TimetableEntryDto(
    DateTime Scheduled,
    DateTime? Realtime,
    int Delay,
    bool Canceled,
    string Line,
    string Direction,
    string TransportMode,
    string Platform
);
