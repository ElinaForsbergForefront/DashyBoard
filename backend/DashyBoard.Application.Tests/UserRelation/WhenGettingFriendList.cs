using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation;
using DashyBoard.Application.Queries.UserRelation.Dto;
using DashyBoard.Domain.Models;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenGettingFriendList
    {
        [Test]
        public async Task ThenValidRequestShouldReturnFriendList()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var expectedFriends = new List<UserRelationDto>
            {
                new UserRelationDto 
                { 
                    UserId = Guid.NewGuid(), 
                    Username = "friend1", 
                    DisplayName = "Friend One",
                    Status = UserRelationshipStatus.Accepted,
                    IsFriend = true,
                    CanRemoveFriend = true
                },
                new UserRelationDto 
                { 
                    UserId = Guid.NewGuid(), 
                    Username = "friend2", 
                    DisplayName = "Friend Two",
                    Status = UserRelationshipStatus.Accepted,
                    IsFriend = true,
                    CanRemoveFriend = true
                }
            };

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.GetFriendListAsync(currentUserId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedFriends);

            var handler = new GetFriendListQuerieHandler(mock.Object);
            var query = new GetFriendListQuery(currentUserId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.EqualTo(expectedFriends));
        }
    }
}