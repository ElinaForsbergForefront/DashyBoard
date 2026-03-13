using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Mirror;
using DashyBoard.Application.Queries.Mirror.Dto;
using Moq;

namespace DashyBoard.Application.Tests.Mirror;

public class WhenGettingMirror
{
    [Test]
    public async Task ThenShouldReturnMirrorById()
    {
        var mirrorId = Guid.NewGuid();
        var expectedMirror = new MirrorDto { Id = mirrorId, UserSub = "auth0|123", Name = "My Mirror", WidthCm = 100, HeightCm = 50 };

        var mock = new Mock<IMirrorRepository>();
        mock
            .Setup(x => x.GetMirrorByIdAsync(mirrorId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMirror);

        var handler = new GetMirrorByIdQueryHandler(mock.Object);

        var result = await handler.Handle(new GetMirrorByIdQuery(mirrorId), CancellationToken.None);

        mock.Verify(x => x.GetMirrorByIdAsync(mirrorId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Test]
    public async Task ThenShouldReturnMirrorsByUserSub()
    {
        var mirrors = new List<MirrorDto>
        {
            new MirrorDto { Id = Guid.NewGuid(), UserSub = "auth0|123", Name = "Mirror 1", WidthCm = 100, HeightCm = 50 },
            new MirrorDto { Id = Guid.NewGuid(), UserSub = "auth0|123", Name = "Mirror 2", WidthCm = 75, HeightCm = 25 }
        };

        var mock = new Mock<IMirrorRepository>();
        mock
            .Setup(x => x.GetMirrorsByUserSubAsync("auth0|123", It.IsAny<CancellationToken>()))
            .ReturnsAsync(mirrors);

        var handler = new GetMirrorsByUserSubQueryHandler(mock.Object);

        var result = await handler.Handle(new GetMirrorsByUserSubQuery("auth0|123"), CancellationToken.None);

        mock.Verify(x => x.GetMirrorsByUserSubAsync("auth0|123", It.IsAny<CancellationToken>()), Times.Once);
    }
}
