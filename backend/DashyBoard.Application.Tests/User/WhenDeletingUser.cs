using Moq;
using DashyBoard.Application.Commands.User;
using DashyBoard.Application.Interfaces;

namespace DashyBoard.Application.Tests.User
{
    public class WhenDeletingUser
    {

        [Test]
        public async Task ThenItShouldDeleteTheByIdUser()
        {
            // Arrange
            var userId = Guid.NewGuid();

            var mock = new Mock<IUserRepository>();
            mock
                .Setup(x => x.DeleteUserByIdAsync(userId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new DeleteUserByIdCommandHandler(mock.Object);
            var command = new DeleteUserByIdCommand(userId);
            // Act
            await handler.Handle(command, CancellationToken.None);
            // Assert
            mock.Verify(x => x.DeleteUserByIdAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task ThenItShouldDeleteTheBySubUser()
        {
            // Arrange
            var sub = "auth0|123456";
            var mock = new Mock<IUserRepository>();
            mock
                .Setup(x => x.DeleteUserBySubAsync(sub, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new DeleteUserBySubCommandHandler(mock.Object);
            var command = new DeleteUserBySubCommand(sub);
            // Act
            await handler.Handle(command, CancellationToken.None);
            // Assert
            mock.Verify(x => x.DeleteUserBySubAsync(sub, It.IsAny<CancellationToken>()), Times.Once);
        }

    }
}
