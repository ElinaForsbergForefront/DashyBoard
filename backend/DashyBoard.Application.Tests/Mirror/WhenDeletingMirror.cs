using DashyBoard.Application.Commands.Mirror;
using DashyBoard.Application.Interfaces;
using Moq;

namespace DashyBoard.Application.Tests.Mirror;

public class WhenDeletingMirror
{
    [Test]
    public async Task ThenShouldDeleteMirror()
    {
        var mirrorId = Guid.NewGuid();

        var mock = new Mock<IMirrorRepository>();
        mock
            .Setup(x => x.DeleteMirrorAsync(mirrorId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var handler = new DeleteMirrorCommandHandler(mock.Object);

        await handler.Handle(new DeleteMirrorCommand(mirrorId), CancellationToken.None);

        mock.Verify(x => x.DeleteMirrorAsync(mirrorId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
