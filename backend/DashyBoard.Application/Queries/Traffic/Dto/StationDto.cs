namespace DashyBoard.Application.Queries.Traffic.Dto;

//A station/stop returned by the "all stops" and "search stops by name" endpoints, used to populate the station picker
public record StationDto(
    string GroupId,
    string GroupName,
    string Id, 
    string Name, 
    double Lat, 
    double Lon,
    IReadOnlyList<string> TransportModes);
