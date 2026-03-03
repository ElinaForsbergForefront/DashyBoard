using MediatR;
using DashyBoard.Application.Queries.User.Dto;

namespace DashyBoard.Application.Queries.User
{
    public record GetUserByIdQuery(Guid Id): IRequest<UserDto>;
}
