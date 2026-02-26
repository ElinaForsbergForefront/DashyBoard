using DashyBoard.Application.Queries.Gold.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Gold
{
    public sealed record GetAssetPriceQuery(string Symbol) : IRequest<AssetPriceDto>;
}
