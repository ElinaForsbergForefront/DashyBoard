using Moq;
using DashyBoard.Application.Commands.User;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.User.Dto;

namespace DashyBoard.Application.Tests.User
{
    public class WhenUpdatingUser
    {
        [Test]
        public async Task ThenItShouldUpdateTheUserById()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var mock = new Mock<IUserRepository>();
            mock
                .Setup(x => x.UpdateUserByIdAsync(userId, It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new UserDto());

            var handler = new UpdateUserByIdCommandHandler(mock.Object);
            var command = new UpdateUserByIdCommand(userId, "new_username", "new_displayName", "new_country", "new_city");
            // Act
            var result = await handler.Handle(command, CancellationToken.None);
            // Assert
            mock.Verify(x => x.UpdateUserByIdAsync(userId, "new_username", "new_displayName", "new_country", "new_city", It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task ThenItShouldUpdateTheUserBySub()
        {
            // Arrange
            var sub = "auth_sub";
            var mock = new Mock<IUserRepository>();
            mock
                .Setup(x => x.UpdateUserBySubAsync(sub, It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new UserDto());
            var handler = new UpdateUserBySubCommandHandler(mock.Object);
            var command = new UpdateUserBySubCommand(sub, "new_username", "new_displayName", "new_country", "new_city");
            // Act
            var result = await handler.Handle(command, CancellationToken.None);
            // Assert
            mock.Verify(x => x.UpdateUserBySubAsync(sub, "new_username", "new_displayName", "new_country", "new_city", It.IsAny<CancellationToken>()), Times.Once);

        }
    }
}
