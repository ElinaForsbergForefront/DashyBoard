using DashyBoard.Application.Queries.Mirror.Dto;

namespace DashyBoard.Application.Interfaces;

public interface IMirrorRepository
{
    Task<MirrorDto> GetMirrorByIdAsync(Guid id, CancellationToken ct);
    Task<IEnumerable<MirrorDto>> GetMirrorsByUserIdAsync(string userId, CancellationToken ct);
    Task<MirrorDto> CreateMirrorAsync(string userId, string name, double widthCm, double heightCm, CancellationToken ct);
    Task<MirrorDto> UpdateMirrorAsync(Guid id, string name, double widthCm, double heightCm, CancellationToken ct);
    Task DeleteMirrorAsync(Guid id, CancellationToken ct);
}
