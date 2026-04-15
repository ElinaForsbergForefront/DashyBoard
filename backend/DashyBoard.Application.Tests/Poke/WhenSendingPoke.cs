using DashyBoard.Application.Commands.Poke;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.Poke
{
    public class WhenSendingPoke
    {
        [Test]
        public async Task ThenValidRequestShouldSendPoke()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var toUsername = "friend";

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.SendPokeAsync(currentUserId, toUsername, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new SendPokeCommandHandler(mock.Object);
            var command = new SendPokeCommand(currentUserId, toUsername);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.SendPokeAsync(currentUserId, toUsername, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}