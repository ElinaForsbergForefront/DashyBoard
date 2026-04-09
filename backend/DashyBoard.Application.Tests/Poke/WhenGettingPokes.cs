using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Poke;
using DashyBoard.Application.Queries.Poke.Dto;
using Moq;

namespace DashyBoard.Application.Tests.Poke
{
    public class WhenGettingPokes
    {
        [Test]
        public async Task ThenValidRequestShouldReturnPokes()
        {
            // Arrange
            var currentUserId = Guid.NewGuid();
            var expectedPokes = new List<PokeDto>
            {
                new PokeDto 
                { 
                    Id = Guid.NewGuid(),
                    FromUserId = Guid.NewGuid(),
                    FromUsername = "friend1",
                    ToUserId = currentUserId,
                    CreatedAtUtc = DateTime.UtcNow,
                    IsActive = true,
                    IsSeen = false,
                    CanDismiss = true
                },
                new PokeDto 
                { 
                    Id = Guid.NewGuid(),
                    FromUserId = Guid.NewGuid(),
                    FromUsername = "friend2",
                    ToUserId = currentUserId,
                    CreatedAtUtc = DateTime.UtcNow.AddMinutes(-5),
                    IsActive = true,
                    IsSeen = true,
                    CanDismiss = true
                }
            };

            var mock = new Mock<IFriendRepository>();
            mock
                .Setup(x => x.GetPokesAsync(currentUserId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedPokes);

            var handler = new GetPokesQueryHandler(mock.Object);
            var query = new GetPokesQuery(currentUserId);

            // Act
            var result = await handler.Handle(query, CancellationToken.None);

            // Assert
            Assert.That(result, Is.EqualTo(expectedPokes));
        }
    }
}