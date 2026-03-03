using DashyBoard.Application.Queries.User.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.User
{
    public record GetUserBySubQuery(string Sub) : IRequest<UserDto>;

}
