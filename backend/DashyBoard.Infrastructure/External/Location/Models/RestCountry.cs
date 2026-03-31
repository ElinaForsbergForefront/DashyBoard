namespace DashyBoard.Infrastructure.External.Location.Models
{
    public sealed class RestCountry
    {
        public string Cca2 { get; set; } = string.Empty;
        public RestCountryName Name { get; set; } = new();
        public RestCountryFlags Flags { get; set; } = new();
        public string Flag { get; set; } = string.Empty;
    }
}
