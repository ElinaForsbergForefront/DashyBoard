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

    public async Task<IEnumerable<MirrorDto>> GetMirrorsByUserIdAsync(string userId, CancellationToken ct)
    {
        var mirrors = await _collection
            .Find(m => m.UserId == userId)
            .ToListAsync(ct);

        return mirrors.Select(MapToDto);
    }

    public async Task<MirrorDto> CreateMirrorAsync(string userId, string name, double widthCm, double heightCm, CancellationToken ct)
    {
        var mirror = new Mirror(userId, name, widthCm, heightCm);
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

    private static MirrorDto MapToDto(Mirror mirror) => new()
    {
        Id = mirror.Id,
        UserId = mirror.UserId,
        Name = mirror.Name,
        WidthCm = mirror.WidthCm,
        HeightCm = mirror.HeightCm,
        CreatedAt = mirror.CreatedAt,
    };
}
