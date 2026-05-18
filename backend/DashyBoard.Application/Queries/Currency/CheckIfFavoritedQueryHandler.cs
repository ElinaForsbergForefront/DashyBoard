using DashyBoard.Application.Interfaces;
using MediatR;

namespace DashyBoard.Application.Queries.Currency;

public sealed class CheckIfFavoritedQueryHandler : IRequestHandler<CheckIfFavoritedQuery, bool>
{
    private readonly IFavoriteCurrencyRepository _repository;

    public CheckIfFavoritedQueryHandler(IFavoriteCurrencyRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        CheckIfFavoritedQuery request,
        CancellationToken ct)
    {
        return await _repository.IsFavoritedAsync(request.UserId, request.Symbol, ct);
    }
}