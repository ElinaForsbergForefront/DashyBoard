using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation;
using DashyBoard.Application.Queries.UserRelation.Dto;
using DashyBoard.Domain.Models;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenGettingBlockedUsers
    {
        [Test]
        public async Task ThenValidRequestShouldReturnBlockedUsers()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var expectedBlocked = new List<UserRelationDto>
            {
                new UserRelationDto 
                { 
                    UserId = Guid.NewGuid(), 
                    Username = "blockeduser", 
                    DisplayName = "Blocked User",
                    Status = UserRelationshipStatus.Blocked,
                    IsBlocked = true,
                    CanUnblock = true
                }
            };

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.GetBlockedUsersAsync(currentUserId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedBlocked);

            var handler = new GetBlockedUsersQueryHandler(mock.Object);
            var query = new GetBlockedUsersQuery(currentUserId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.EqualTo(expectedBlocked));
        }
    }
}