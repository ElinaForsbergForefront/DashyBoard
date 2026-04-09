using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenAcceptingFriendRequest
    {
        [Test]
        public async Task ThenValidRequestShouldAcceptFriendRequest()
        {
            // Arrange
            var relationshipId = Guid.NewGuid();
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.AcceptFriendRequestAsync(relationshipId, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new AcceptFriendRequestCommandHandler(mock.Object);
            var command = new AcceptFriendRequestCommand(relationshipId, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.AcceptFriendRequestAsync(relationshipId, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}