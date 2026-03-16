using MediatR;

namespace DashyBoard.Application.Queries.User
{
    public sealed record CheckUsernameQuery(string Username) : IRequest<bool>;
}