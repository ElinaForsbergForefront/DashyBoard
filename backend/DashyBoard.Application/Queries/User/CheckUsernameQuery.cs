using MediatR;

namespace DashyBoard.Application.Queries.User
{
    public record CheckUsernameQuery(string Username) : IRequest<bool>;
}