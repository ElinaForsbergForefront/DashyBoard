using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Currency.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed class GetUserFavoritesQueryHandler : IRequestHandler<GetUserFavoritesQuery, List<FavoriteCurrencyDto>>
{
    private readonly IFavoriteCurrencyRepository _repository;

    public GetUserFavoritesQueryHandler(IFavoriteCurrencyRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<FavoriteCurrencyDto>> Handle(
        GetUserFavoritesQuery request,
        CancellationToken ct)
    {
        return await _repository.GetUserFavoritesAsync(request.UserId, ct);
    }
}