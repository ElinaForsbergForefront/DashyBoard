using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenRemovingFriend
    {
        [Test]
        public async Task ThenValidRequestShouldRemoveFriend()
        {
            // Arrange
            var username = "testuser";
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.RemoveFriendAsync(username, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new RemoveFriendCommandHandler(mock.Object);
            var command = new RemoveFriendCommand(username, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.RemoveFriendAsync(username, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}