using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenSendingFriendRequest
    {
        [Test]
        public async Task ThenValidRequestShouldSendFriendRequest()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var receiverUsername = "testuser";

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.SendFriendRequestAsync(currentUserId, receiverUsername, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new SendFriendRequestCommandHandler(mock.Object);
            var command = new SendFriendRequestCommand(currentUserId, receiverUsername);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.SendFriendRequestAsync(currentUserId, receiverUsername, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}