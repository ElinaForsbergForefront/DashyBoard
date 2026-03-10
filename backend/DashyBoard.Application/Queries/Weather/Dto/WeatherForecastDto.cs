using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using DashyBoard.Domain.Models;

namespace DashyBoard.Application.Queries.Weather.Dto
{
    public sealed record WeatherForecastDto
    (
        double latitude,
        double longitude,
        Forecast hourly
    );

    public sealed record Forecast
    (
        [property: JsonPropertyName("time")] List<string> Time,
        [property: JsonPropertyName("temperature_2m")] List<double> Temperature,
        [property: JsonPropertyName("weather_code")] List<WeatherType> WeatherCode,
        [property: JsonPropertyName("wind_speed_10m")] List<double> WindSpeed,
        [property: JsonPropertyName("precipitation")] List<double> Precipitation,
        [property: JsonPropertyName("precipitation_probability")] List<int> PrecipitationProbability
    );

}
