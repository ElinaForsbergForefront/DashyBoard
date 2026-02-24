using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Domain.Models
{
    public class User
    {
        public Guid Id { get; private set; } 
        public string AuthSub { get; private set; } 
        public string Email { get; private set; } 
        public string? Username { get; private set; }
        public string? DisplayName { get; private set; }
        public string? Country { get; private set; }
        public string? City { get; private set; }
        public DateTime CreatedAt { get; private set; } = DateTime.Now;

        private User() { }

        public User(string authSub, string email, string username, string displayName, string country, string city)
        {
            Id = Guid.NewGuid();
            AuthSub = authSub;
            Email = email;
            Username = username;
            DisplayName = displayName;
            Country = country;
            City = city;
            CreatedAt = DateTime.UtcNow;
        }
    }
}
