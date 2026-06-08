using System.Text.Json;
using DashyBoard.Application.Queries.Mirror.Dto;

namespace DashyBoard.Application.Interfaces;

public interface IWidgetConfigurationService
{
    IReadOnlyDictionary<string, object?> BuildPersistedConfig(string widgetType, JsonElement? rawConfig);
    WidgetConfigDto BuildDto(string widgetType, IReadOnlyDictionary<string, object?>? persistedConfig);
}