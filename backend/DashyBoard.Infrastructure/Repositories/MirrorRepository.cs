using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using DashyBoard.Domain.Models;
using MongoDB.Driver;

namespace DashyBoard.Infrastructure.Repositories;

public sealed class MirrorRepository : IMirrorRepository
{
    private readonly IMongoCollection<Mirror> _collection;

    public MirrorRepository(IMongoDatabase database)
    {
        _collection = database.GetCollection<Mirror>("mirrors");
    }

    public async Task<MirrorDto> GetMirrorByIdAsync(Guid id, CancellationToken ct)
    {
        var mirror = await _collection
            .Find(m => m.Id == id)
            .FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException($"Mirror with id {id} not found");

        return MapToDto(mirror);
    }

    public async Task<IEnumerable<MirrorDto>> GetMirrorsByUserSubAsync(string userSub, CancellationToken ct)
    {
        var mirrors = await _collection
            .Find(m => m.UserSub == userSub)
            .ToListAsync(ct);

        return mirrors.Select(MapToDto);
    }

    public async Task<MirrorDto> CreateMirrorAsync(string userSub, string name, double widthCm, double heightCm, CancellationToken ct)
    {
        var mirror = new Mirror(userSub, name, widthCm, heightCm);
        await _collection.InsertOneAsync(mirror, cancellationToken: ct);
        return MapToDto(mirror);
    }

    public async Task<MirrorDto> UpdateMirrorAsync(Guid id, string name, double widthCm, double heightCm, CancellationToken ct)
    {
        var mirror = await _collection
            .Find(m => m.Id == id)
            .FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException($"Mirror with id {id} not found.");

        mirror.Update(name, widthCm, heightCm);
        await _collection.ReplaceOneAsync(m => m.Id == id, mirror, cancellationToken: ct);
        return MapToDto(mirror);
    }

    public async Task DeleteMirrorAsync(Guid id, CancellationToken ct)
    {
        var result = await _collection.DeleteOneAsync(m => m.Id == id, ct);
        if (result.DeletedCount == 0)
            throw new KeyNotFoundException($"Mirror with id {id} not found.");
    }

    public async Task<MirrorDto> AddWidgetAsync(Guid mirrorId, string type, double x, double y, CancellationToken ct)
    {
        var mirror = await _collection
            .Find(m => m.Id == mirrorId)
            .FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException($"Mirror with id {mirrorId} not found.");

        mirror.AddWidget(type, x, y);

        await _collection.ReplaceOneAsync(m => m.Id == mirrorId, mirror, cancellationToken: ct);

        return MapToDto(mirror);
    }

    public async Task<MirrorDto> MoveWidgetAsync(Guid mirrorId, Guid widgetId, double x, double y, CancellationToken ct)
    {
        var mirror = await _collection
            .Find(m => m.Id == mirrorId)
            .FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException($"Mirror with id {mirrorId} not found.");

        mirror.MoveWidget(widgetId, x, y);

        await _collection.ReplaceOneAsync(m => m.Id == mirrorId, mirror, cancellationToken: ct);

        return MapToDto(mirror);
    }

    public async Task<MirrorDto> RemoveWidgetAsync(Guid mirrorId, Guid widgetId, CancellationToken ct)
    {
        var mirror = await _collection
            .Find(m => m.Id == mirrorId)
            .FirstOrDefaultAsync(ct)
            ?? throw new KeyNotFoundException($"Mirror with id {mirrorId} not found.");

        mirror.RemoveWidget(widgetId);

        await _collection.ReplaceOneAsync(m => m.Id == mirrorId, mirror, cancellationToken: ct);

        return MapToDto(mirror);
    }

    private static MirrorDto MapToDto(Mirror mirror) => new()
    {
        Id = mirror.Id,
        UserSub = mirror.UserSub,
        Name = mirror.Name,
        WidthCm = mirror.WidthCm,
        HeightCm = mirror.HeightCm,
        CreatedAt = mirror.CreatedAt,
        Widgets = mirror.Widgets.Select(MapWidgetToDto).ToList()
    };

    private static WidgetDto MapWidgetToDto(Widget widget) => new()
    {
        Id = widget.Id,
        Type = widget.Type,
        X = widget.X,
        Y = widget.Y
    };
}
