using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation;
using DashyBoard.Application.Queries.UserRelation.Dto;
using DashyBoard.Domain.Models;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenGettingFriend
    {
        [Test]
        public async Task ThenValidRequestShouldReturnFriend()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var otherUsername = "testuser";
            var expectedFriend = new UserRelationDto 
            { 
                UserId = Guid.NewGuid(), 
                Username = otherUsername, 
                DisplayName = "Test User",
                Status = UserRelationshipStatus.Accepted,
                IsFriend = true,
                CanRemoveFriend = true
            };

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.GetFriendAsync(currentUserId, otherUsername, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedFriend);

            var handler = new GetFriendQueryHandler(mock.Object);
            var query = new GetFriendQuery(currentUserId, otherUsername);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.EqualTo(expectedFriend));
        }

        [Test]
        public async Task ThenInvalidUsernameShouldReturnNull()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var otherUsername = "nonexistent";

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.GetFriendAsync(currentUserId, otherUsername, It.IsAny<CancellationToken>()))
                .ReturnsAsync((UserRelationDto?)null);

            var handler = new GetFriendQueryHandler(mock.Object);
            var query = new GetFriendQuery(currentUserId, otherUsername);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.Null);
        }
    }
}