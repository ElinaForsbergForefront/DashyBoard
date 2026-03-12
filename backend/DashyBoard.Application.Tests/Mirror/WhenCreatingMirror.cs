using DashyBoard.Application.Commands.Mirror;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using Moq;

namespace DashyBoard.Application.Tests.Mirror;

public class WhenCreatingMirror
{
    [Test]
    public async Task ThenShouldCreateMirror()
    {
        var expectedMirror = new MirrorDto
        {
            Id = Guid.NewGuid(),
            UserId = "auth0|123",
            Name = "My Mirror",
            WidthCm = 100,
            HeightCm = 50,
            CreatedAt = DateTime.UtcNow
        };

        var mock = new Mock<IMirrorRepository>();
        mock
            .Setup(x => x.CreateMirrorAsync("auth0|123", "My Mirror", 100, 50, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMirror);

        var handler = new CreateMirrorCommandHandler(mock.Object);
        var command = new CreateMirrorCommand("auth0|123", "My Mirror", 100, 50);

        var result = await handler.Handle(command, CancellationToken.None);

        mock.Verify(x => x.CreateMirrorAsync("auth0|123", "My Mirror", 100, 50, It.IsAny<CancellationToken>()), Times.Once);
    }
}
