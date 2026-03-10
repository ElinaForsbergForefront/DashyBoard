using DashyBoard.Domain.Models;

namespace DashyBoard.Application.Mappers.Weather
{
    public static class WeatherCodeMapper
    {
        public static WeatherType ToWeatherType(int code) => code switch
        {
            0 => WeatherType.ClearSky,
            1 => WeatherType.MainlyClear,
            2 => WeatherType.PartlyCloudy,
            3 => WeatherType.Overcast,
            45 or 48 => WeatherType.Fog,
            51 or 53 or 55 => WeatherType.Drizzle,
            61 or 63 or 65 => WeatherType.Rain,
            71 or 73 or 75 => WeatherType.SnowFall,
            80 or 81 or 82 => WeatherType.RainShowers,
            85 or 86 => WeatherType.SnowShowers,
            95 => WeatherType.Thunderstorm,
            96 or 99 => WeatherType.ThunderstormWithHail,
            _ => WeatherType.Unknown
        };
    }
}
