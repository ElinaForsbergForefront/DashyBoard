using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation;

public class WhenRejectingFriendRequest
{
    [Test]
    public async Task ThenValidRequestShouldRejectFriendRequest()
    {
        // Arrange
        var currentUserId = Guid.NewGuid();
        var username = "friend-user";

        var mock = new Mock<IFriendRepository>();
        mock
            .Setup(x => x.RejectFriendRequestAsync(username, currentUserId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new RejectFriendRequestCommandHandler(mock.Object);
        var command = new RejectFriendRequestCommand(username, currentUserId);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mock.Verify(
            x => x.RejectFriendRequestAsync(username, currentUserId, It.IsAny<CancellationToken>()),
            Times.Once);
    }
}