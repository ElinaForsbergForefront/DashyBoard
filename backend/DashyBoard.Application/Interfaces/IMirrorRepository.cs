using DashyBoard.Application.Queries.Mirror.Dto;

namespace DashyBoard.Application.Interfaces;

public interface IMirrorRepository
{
    Task<MirrorDto> GetMirrorByIdAsync(Guid id, CancellationToken ct);
    Task<IEnumerable<MirrorDto>> GetMirrorsByUserSubAsync(string userSub, CancellationToken ct);
    Task<MirrorDto> CreateMirrorAsync(string userSub, string name, double widthCm, double heightCm, CancellationToken ct);
    Task<MirrorDto> UpdateMirrorAsync(Guid id, string name, double widthCm, double heightCm, CancellationToken ct);
    Task DeleteMirrorAsync(Guid id, CancellationToken ct);

    Task<MirrorDto> AddWidgetAsync(Guid mirrorId, string type, double x, double y, CancellationToken ct);
    Task<MirrorDto> MoveWidgetAsync(Guid mirrorId, Guid widgetId, double x, double y, CancellationToken ct);
    Task<MirrorDto> RemoveWidgetAsync(Guid mirrorId, Guid widgetId, CancellationToken ct);

}
