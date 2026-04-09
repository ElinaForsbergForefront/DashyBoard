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
            var relationshipId = Guid.NewGuid();
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.BlockUserAsync(relationshipId, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new BlockUserCommandHandler(mock.Object);
            var command = new BlockUserCommand(relationshipId, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.BlockUserAsync(relationshipId, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}