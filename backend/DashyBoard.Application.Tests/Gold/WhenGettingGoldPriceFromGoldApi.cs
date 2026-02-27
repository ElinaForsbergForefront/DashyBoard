using System;
using System.Collections.Generic;
using Moq;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Gold;
using DashyBoard.Application.Queries.Gold.Dto;

namespace DashyBoard.Application.Tests.Gold
{
    public class WhenGettingGoldPriceFromGoldApi
    {

        [Test]
        public async Task ThenValidRequestShouldReturnPrice()
        {
            // Arrange
            var expectedPrice = new AssetPriceDto(
                "Gold",
                "XAU",
                1800.50m,
                DateTime.UtcNow,
                "Just now"
            );

            // Meningen med detta test är inte att testa det externa Gold API:t,
            // utan att verifiera att handlern anropar klienten korrekt
            // och returnerar den data som den får tillbaka.
            var mockClient = new Mock<IGoldApiClient>();
            mockClient
                .Setup(x => x.GetPriceAsync("XAU", It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedPrice);

            var handler = new GetAssetPriceQueryHandler(mockClient.Object);


            // Act
            var result = await handler.Handle(
                new GetAssetPriceQuery("XAU"),
                CancellationToken.None);

            // Assert
            Assert.That(result.Name, Is.EqualTo("Gold"));
            Assert.That(result.Price, Is.EqualTo(1800.50m));
        }
    }
}
