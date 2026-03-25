namespace DashyBoard.Infrastructure.External.Location.Models
{
    public sealed record CountriesNowCitiesResponse(
       bool Error,
       string Msg,
       List<string> Data
   );
}
