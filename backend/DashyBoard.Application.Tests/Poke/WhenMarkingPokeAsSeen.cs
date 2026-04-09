using DashyBoard.Application.Commands.Poke;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.Poke
{
    public class WhenMarkingPokeAsSeen
    {
        [Test]
        public async Task ThenValidRequestShouldMarkPokeAsSeen()
        {
            // Arrange
            var pokeId = Guid.NewGuid();
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.MarkPokeAsSeenAsync(pokeId, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new MarkPokeAsSeenCommandHandler(mock.Object);
            var command = new MarkPokeAsSeenCommand(pokeId, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.MarkPokeAsSeenAsync(pokeId, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}