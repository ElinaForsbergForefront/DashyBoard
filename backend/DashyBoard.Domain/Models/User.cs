using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Domain.Models
{
    public class User
    {
        public Guid Id { get; private set; }
        public string Email { get; private set; }

        private User() { }

        public User(string email)
        {
            Id = Guid.NewGuid();
            Email = email;
        }
    }
}
