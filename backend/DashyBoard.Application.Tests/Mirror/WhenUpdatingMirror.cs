using DashyBoard.Application.Commands.Mirror;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror.Dto;
using Moq;

namespace DashyBoard.Application.Tests.Mirror;

public class WhenUpdatingMirror
{
    [Test]
    public async Task ThenShouldUpdateMirror()
    {
        var mirrorId = Guid.NewGuid();
        var expectedMirror = new MirrorDto { Id = mirrorId, UserId = "auth0|123", Name = "Updated", WidthCm = 200, HeightCm = 75 };

        var mock = new Mock<IMirrorRepository>();
        mock
            .Setup(x => x.UpdateMirrorAsync(mirrorId, "Updated", 200, 75, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMirror);

        var handler = new UpdateMirrorCommandHandler(mock.Object);
        var command = new UpdateMirrorCommand(mirrorId, "Updated", 200, 75);

        var result = await handler.Handle(command, CancellationToken.None);

        mock.Verify(x => x.UpdateMirrorAsync(mirrorId, "Updated", 200, 75, It.IsAny<CancellationToken>()), Times.Once);
    }
}
