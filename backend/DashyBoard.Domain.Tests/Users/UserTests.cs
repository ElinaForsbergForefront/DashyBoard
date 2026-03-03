using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Domain.Models;

namespace DashyBoard.Domain.Tests.Users
{
    public class UserTests
    {
        [Test]
        public void Create_WithValidData_SetsAuthSub()
        {
            var user = new User("auth0|123", "test@test.com");
            Assert.That(user.AuthSub, Is.EqualTo("auth0|123"));
        }

        [Test]
        public void Create_WithValidData_SetsEmail()
        {
            var user = new User("auth0|123", "test@test.com");
            Assert.That(user.Email, Is.EqualTo("test@test.com"));
        }

        [Test]
        public void Create_WithValidData_GeneratesId()
        {
            var user = new User("auth0|123", "test@test.com");
            Assert.That(user.Id, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void Create_WithValidData_SetsCreatedAt()
        {
            var before = DateTime.UtcNow;
            var user = new User("auth0|123", "test@test.com");
            Assert.That(user.CreatedAt, Is.GreaterThanOrEqualTo(before));
        }

        [Test]
        public void Create_WithOptionalFields_SetsOptionalFields()
        {
            var user = new User("auth0|123", "test@test.com", "username", "Display Name", "Sweden", "Stockholm");
            Assert.That(user.Username, Is.EqualTo("username"));
            Assert.That(user.DisplayName, Is.EqualTo("Display Name"));
            Assert.That(user.Country, Is.EqualTo("Sweden"));
            Assert.That(user.City, Is.EqualTo("Stockholm"));
        }

        [Test]
        public void Create_WithoutOptionalFields_OptionalFieldsAreNull()
        {
            var user = new User("auth0|123", "test@test.com");
            Assert.That(user.Username, Is.Null);
            Assert.That(user.DisplayName, Is.Null);
            Assert.That(user.Country, Is.Null);
            Assert.That(user.City, Is.Null);
        }

        [Test]
        public void Update_WithValidData_UpdatesFields()
        {
            var user = new User("auth0|123", "test@test.com");
            user.Update("newUsername", "New Name", "Norway", "Oslo");
            Assert.That(user.Username, Is.EqualTo("newUsername"));
            Assert.That(user.DisplayName, Is.EqualTo("New Name"));
            Assert.That(user.Country, Is.EqualTo("Norway"));
            Assert.That(user.City, Is.EqualTo("Oslo"));
        }

        [Test]
        public void Update_DoesNotChangeAuthSub()
        {
            var user = new User("auth0|123", "test@test.com");
            user.Update("newUsername", "New Name", "Norway", "Oslo");
            Assert.That(user.AuthSub, Is.EqualTo("auth0|123"));
        }

        [Test]
        public void Update_DoesNotChangeEmail()
        {
            var user = new User("auth0|123", "test@test.com");
            user.Update("newUsername", "New Name", "Norway", "Oslo");
            Assert.That(user.Email, Is.EqualTo("test@test.com"));
        }

        [Test]
        public void Update_DoesNotChangeId()
        {
            var user = new User("auth0|123", "test@test.com");
            var originalId = user.Id;
            user.Update("newUsername", "New Name", "Norway", "Oslo");
            Assert.That(user.Id, Is.EqualTo(originalId));
        }
    }
}
