using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenBlockingUser
    {
        [Test]
        public async Task ThenValidRequestShouldBlockUser()
        {
            // Arrange
            var username = "testuser";
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.BlockUserAsync(username, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new BlockUserCommandHandler(mock.Object);
            var command = new BlockUserCommand(username, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.BlockUserAsync(username, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}