using DashyBoard.Application.Queries.User.Dto;
using Moq;
using DashyBoard.Application.Interfaces;    
using DashyBoard.Application.Queries.User;


namespace DashyBoard.Application.Tests.User
{
    public class WhenGettingUser
    {
        [Test]
        public async Task ThenShouldReturnUserBySub()
        {
            // Arrange
            var expectedUser = new UserDto
            {
                Id = Guid.NewGuid(),
                AuthSub = "test-sub",
                Email = "test@test.com",
                Username = "testuser",
                DisplayName = "Test User",
                Country = "Testland",
                City = "Testville"
            };

            var mock = new Mock<IUserRepository>();
            mock
                .Setup(x => x.GetUserBySubAsync("test-sub", It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedUser);

            var handler = new GetUserBySubQueryHandler(mock.Object);
            var query = new GetUserBySubQuery("test-sub");

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            mock.Verify(x => x.GetUserBySubAsync("test-sub", It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task ThenShouldReturnUserById()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var expectedUser = new UserDto
            {
                Id = userId,
                AuthSub = "test-sub",
                Email = "test@test.com",
                Username = "testuser",
                DisplayName = "Test User",
                Country = "Testland",
                City = "Testville"
            };

            var mock = new Mock<IUserRepository>();
            mock
                .Setup(x => x.GetUserByIdAsync(userId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedUser);

            var handler = new GetUserByIdQueryHandler(mock.Object);
            var query = new GetUserByIdQuery(userId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            mock.Verify(x => x.GetUserByIdAsync(userId, It.IsAny<CancellationToken>()), Times.Once);

        }
    }
}