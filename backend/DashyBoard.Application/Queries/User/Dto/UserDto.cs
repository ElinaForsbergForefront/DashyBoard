using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.User.Dto
{
    public sealed record UserDto
    {
        public Guid Id { get; set;}
        public  string Email { get; set;} = null!;
        public string Username { get; set; } = null!;
        public string DisplayName { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string City { get; set; } = null!;
        public string AuthSub { get; set; } = null!;

    }
}
