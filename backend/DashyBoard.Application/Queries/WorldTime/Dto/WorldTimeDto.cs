namespace DashyBoard.Application.Queries.WorldTime.Dto;

//TODO: eventuellt ta bort vissa fält som inte används
public record WorldTimeDto(
    int Year,
    int Month,
    int Day,
    int Hour,
    int Minute,
    int Seconds,
    int MilliSeconds,
    string DateTime,
    string Date,
    string Time,
    string TimeZone,
    string DayOfWeek
);