using MediatR;

namespace DashyBoard.Application.Queries.User
{
    public sealed record GetAllUsernamesQuery : IRequest<IEnumerable<string>>;
}
