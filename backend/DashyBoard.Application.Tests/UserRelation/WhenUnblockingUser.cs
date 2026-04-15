using DashyBoard.Application.Commands.UserRelation;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.UserRelation
{
    public class WhenUnblockingUser
    {
        [Test]
        public async Task ThenValidRequestShouldUnblockUser()
        {
            // Arrange
            var username = "testuser";
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.UnblockUserAsync(username, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new UnBlockUserCommandHandler(mock.Object);
            var command = new UnBlockUserCommand(username, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.UnblockUserAsync(username, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}