using Moq;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Gold;
using DashyBoard.Application.Queries.Gold.Dto;

namespace DashyBoard.Application.Tests.Gold
{
    public class WhenGettingAssetTickersFromGoldApi
    {
        [Test]
        public async Task ThenValidRequestShouldReturnTickers()
        {
            // Arrange
            var expectedTickers = new List<AssetTickersDto>
            {
                new AssetTickersDto("Gold", "XAU"),
                new AssetTickersDto("Bitcoin", "BTC")
            };

            // Meningen med detta test är inte att testa det externa Gold API:t,
            // utan att verifiera att handlern anropar klienten korrekt
            // och returnerar den data som den får tillbaka.
            var mockClient = new Mock<IGoldApiClient>();
            mockClient
                .Setup(x => x.GetApiAssetTickerAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedTickers);

            var handler = new GetAssetTickersQueryHandler(mockClient.Object);

            // Act
            var result = await handler.Handle(
                new GetAssetTickersQuery(),
                CancellationToken.None);

            // Assert
            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result.First().Symbol, Is.EqualTo("Gold"));
        }
    }
}
