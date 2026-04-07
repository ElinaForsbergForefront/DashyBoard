using System.Text.Json.Serialization;

namespace DashyBoard.Infrastructure.External.Location.Models
{
    public sealed class GeoapifyAutocompleteResponse
    {
        [JsonPropertyName("results")]
        public List<GeoapifyResult> Results { get; set; } = new();
    }

    public sealed class GeoapifyResult
    {
        [JsonPropertyName("city")]
        public string? City { get; set; }

        [JsonPropertyName("country")]
        public string? Country { get; set; }

        [JsonPropertyName("result_type")]
        public string? ResultType { get; set; }

        [JsonPropertyName("formatted")]
        public string? Formatted { get; set; }
    }
}
