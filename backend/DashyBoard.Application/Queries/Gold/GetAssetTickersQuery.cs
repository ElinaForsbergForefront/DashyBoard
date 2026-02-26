using MediatR;
using DashyBoard.Application.Queries.Gold.Dto;

namespace DashyBoard.Application.Queries.Gold
{
    public record GetAssetTickersQuery() : IRequest<IReadOnlyList<AssetTickersDto>>;
}
