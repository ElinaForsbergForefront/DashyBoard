using DashyBoard.Application.Commands.Poke;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.Poke
{
    public class WhenInactivatingPoke
    {
        [Test]
        public async Task ThenValidRequestShouldInactivatePoke()
        {
            // Arrange
            var pokeId = Guid.NewGuid();
            var currentUserId = Guid.NewGuid();

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.InactivatePokeAsync(pokeId, currentUserId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new InActivatePokeCommandHandler(mock.Object);
            var command = new InActivatePokeCommand(pokeId, currentUserId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.InactivatePokeAsync(pokeId, currentUserId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}