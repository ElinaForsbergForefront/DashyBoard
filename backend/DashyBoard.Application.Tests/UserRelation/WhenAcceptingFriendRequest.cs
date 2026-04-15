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
            var username = "testuser";
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.AcceptFriendRequestAsync(username, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new AcceptFriendRequestCommandHandler(mock.Object);
            var command = new AcceptFriendRequestCommand(username, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.AcceptFriendRequestAsync(username, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}