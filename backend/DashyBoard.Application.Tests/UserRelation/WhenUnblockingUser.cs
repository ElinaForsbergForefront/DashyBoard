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
            var relationshipId = Guid.NewGuid();
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.UnblockUserAsync(relationshipId, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new UnBlockUserCommandHandler(mock.Object);
            var command = new UnBlockUserCommand(relationshipId, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.UnblockUserAsync(relationshipId, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}