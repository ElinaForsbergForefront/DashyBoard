using System.Text.Json;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;

namespace DashyBoard.Application.Utilities;

public sealed class WidgetConfigurationService : IWidgetConfigurationService
{
    private static readonly string[] DefaultTrafficTransportModes = ["BUS", "TRAM", "TRAIN"];

    private static readonly HashSet<string> AllowedTrafficTransportModes = new(StringComparer.OrdinalIgnoreCase)
    {
        "BUS",
        "TRAM",
        "TRAIN",
    };

    public IReadOnlyDictionary<string, object?> BuildPersistedConfig(string widgetType, JsonElement? rawConfig)
    {
        var normalizedType = NormalizeWidgetType(widgetType);
        var config = ParseConfigObject(rawConfig);

        return normalizedType switch
        {
            "clock" or "clock-mini" => BuildClockConfig(config),
            "weather" or "weather-mini" => BuildWeatherConfig(config),
            "currency" or "currency-mini" => BuildCurrencyConfig(config),
            "traffic" or "traffic-mini" => BuildTrafficConfig(config),
            "weather-forecast" => BuildWeatherConfig(config),
            _ => BuildEmptyConfig(config, normalizedType),
        };
    }

    public WidgetConfigDto BuildDto(string widgetType, IReadOnlyDictionary<string, object?>? persistedConfig)
    {
        var normalizedType = NormalizeWidgetType(widgetType);

        return normalizedType switch
        {
            "clock" or "clock-mini" => new ClockWidgetConfigDto
            {
                Timezone = ReadPersistedString(persistedConfig, "timezone"),
            },
            "weather" or "weather-mini" => new WeatherWidgetConfigDto
            {
                City = ReadPersistedString(persistedConfig, "city"),
            },
            "weather-forecast" => new WeatherForecastWidgetConfigDto
            {
                City = ReadPersistedString(persistedConfig, "city"),
            },
            "currency" or "currency-mini" => new CurrencyWidgetConfigDto
            {
                Symbol = ReadPersistedString(persistedConfig, "symbol"),
            },
            "traffic" or "traffic-mini" => new TrafficWidgetConfigDto
            {
                StationName = ReadPersistedString(persistedConfig, "stationName"),
                TransportModes = ReadPersistedStringList(persistedConfig, "transportModes", DefaultTrafficTransportModes).ToList(),
            },
            _ => new EmptyWidgetConfigDto(),
        };
    }

    private static IReadOnlyDictionary<string, object?> BuildClockConfig(IReadOnlyDictionary<string, JsonElement> config)
    {
        return new Dictionary<string, object?>
        {
            ["timezone"] = ReadOptionalString(config, "timezone")?.Trim() ?? string.Empty,
        };
    }

    private static IReadOnlyDictionary<string, object?> BuildWeatherConfig(IReadOnlyDictionary<string, JsonElement> config)
    {
        return new Dictionary<string, object?>
        {
            ["city"] = ReadOptionalString(config, "city")?.Trim() ?? string.Empty,
        };
    }

    private static IReadOnlyDictionary<string, object?> BuildCurrencyConfig(IReadOnlyDictionary<string, JsonElement> config)
    {
        return new Dictionary<string, object?>
        {
            ["symbol"] = ReadOptionalString(config, "symbol")?.Trim() ?? string.Empty,
        };
    }

    private static IReadOnlyDictionary<string, object?> BuildTrafficConfig(IReadOnlyDictionary<string, JsonElement> config)
    {
        var transportModes = ReadStringArray(config, "transportModes")
            .Select(mode => mode.Trim().ToUpperInvariant())
            .Where(mode => AllowedTrafficTransportModes.Contains(mode))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (transportModes.Count == 0)
        {
            transportModes = DefaultTrafficTransportModes.ToList();
        }

        return new Dictionary<string, object?>
        {
            ["stationName"] = ReadOptionalString(config, "stationName")?.Trim() ?? string.Empty,
            ["transportModes"] = transportModes.ToArray(),
        };
    }

    private static IReadOnlyDictionary<string, object?> BuildEmptyConfig(
        IReadOnlyDictionary<string, JsonElement> config,
        string widgetType)
    {
        if (config.Count > 0)
        {
            throw new ArgumentException($"Widget type '{widgetType}' does not support configuration.");
        }

        return new Dictionary<string, object?>();
    }

    private static string NormalizeWidgetType(string widgetType)
    {
        if (string.IsNullOrWhiteSpace(widgetType))
        {
            throw new ArgumentException("Widget type is required.");
        }

        return widgetType.Trim().ToLowerInvariant();
    }

    private static Dictionary<string, JsonElement> ParseConfigObject(JsonElement? rawConfig)
    {
        if (!rawConfig.HasValue || rawConfig.Value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return new Dictionary<string, JsonElement>(StringComparer.OrdinalIgnoreCase);
        }

        if (rawConfig.Value.ValueKind != JsonValueKind.Object)
        {
            throw new ArgumentException("Widget config must be a JSON object.");
        }

        return rawConfig.Value
            .EnumerateObject()
            .ToDictionary(property => property.Name, property => property.Value, StringComparer.OrdinalIgnoreCase);
    }

    private static string? ReadOptionalString(IReadOnlyDictionary<string, JsonElement> config, string key)
    {
        if (!config.TryGetValue(key, out var value))
        {
            return null;
        }

        return value.ValueKind switch
        {
            JsonValueKind.String => value.GetString(),
            JsonValueKind.Null or JsonValueKind.Undefined => null,
            _ => throw new ArgumentException($"Widget config field '{key}' must be a string."),
        };
    }

    private static IReadOnlyList<string> ReadStringArray(IReadOnlyDictionary<string, JsonElement> config, string key)
    {
        if (!config.TryGetValue(key, out var value))
        {
            return Array.Empty<string>();
        }

        if (value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return Array.Empty<string>();
        }

        if (value.ValueKind != JsonValueKind.Array)
        {
            throw new ArgumentException($"Widget config field '{key}' must be an array.");
        }

        return value
            .EnumerateArray()
            .Select(item =>
            {
                if (item.ValueKind != JsonValueKind.String)
                {
                    throw new ArgumentException($"Widget config field '{key}' must only contain strings.");
                }

                return item.GetString() ?? string.Empty;
            })
            .ToList();
    }

    private static string ReadPersistedString(
        IReadOnlyDictionary<string, object?>? persistedConfig,
        string key)
    {
        if (persistedConfig is null || !persistedConfig.TryGetValue(key, out var value) || value is null)
        {
            return string.Empty;
        }

        return value switch
        {
            string text => text,
            JsonElement json when json.ValueKind == JsonValueKind.String => json.GetString() ?? string.Empty,
            _ => string.Empty,
        };
    }

    private static IReadOnlyList<string> ReadPersistedStringList(
        IReadOnlyDictionary<string, object?>? persistedConfig,
        string key,
        IEnumerable<string> fallback)
    {
        if (persistedConfig is null || !persistedConfig.TryGetValue(key, out var value) || value is null)
        {
            return fallback.ToArray();
        }

        if (value is IEnumerable<string> stringValues)
        {
            var result = stringValues
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim().ToUpperInvariant())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            return result.Count > 0 ? result : fallback.ToArray();
        }

        if (value is IEnumerable<object?> objectValues)
        {
            var result = objectValues
                .OfType<string>()
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim().ToUpperInvariant())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            return result.Count > 0 ? result : fallback.ToArray();
        }

        if (value is JsonElement json && json.ValueKind == JsonValueKind.Array)
        {
            var result = json
                .EnumerateArray()
                .Where(item => item.ValueKind == JsonValueKind.String)
                .Select(item => item.GetString() ?? string.Empty)
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim().ToUpperInvariant())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            return result.Count > 0 ? result : fallback.ToArray();
        }

        return fallback.ToArray();
    }
}