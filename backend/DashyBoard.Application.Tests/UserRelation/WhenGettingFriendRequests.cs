using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.UserRelation;
using DashyBoard.Application.Queries.UserRelation.Dto;
using DashyBoard.Domain.Models;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenGettingFriendRequests
    {
        [Test]
        public async Task ThenValidRequestShouldReturnFriendRequests()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var expectedRequests = new List<UserRelationDto>
            {
                new UserRelationDto 
                { 
                    UserId = Guid.NewGuid(), 
                    Username = "requester1", 
                    DisplayName = "Requester One",
                    Status = UserRelationshipStatus.Pending,
                    IsIncomingRequest = true,
                    CanAccept = true,
                    CanDecline = true
                }
            };

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.GetFriendRequestsAsync(currentUserId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedRequests);

            var handler = new GetFriendRequestsQueryHandler(mock.Object);
            var query = new GetFriendRequestsQuery(currentUserId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.EqualTo(expectedRequests));
        }
    }
}