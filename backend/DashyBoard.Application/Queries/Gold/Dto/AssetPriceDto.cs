
namespace DashyBoard.Application.Queries.Gold.Dto
{
    public sealed record AssetPriceDto(
     string Name,
     string Symbol,
     decimal Price,
     DateTime UpdatedAt,
     string? UpdatedAtReadable
    );
}
