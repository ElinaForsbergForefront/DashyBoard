using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location;
using DashyBoard.Application.Queries.Location.Dto;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Tests.Location
{
    public class WhenGettingCityByName
    {
        [Test]
        public async Task ThenShouldReturnCity()
        {
            //Arrange
            var expectedResult = new List<CityDto>
                    {
                        new CityDto("Stockholm", "SE")
                    };

            var mockClient = new Mock<ICityApiClient>();
            mockClient.Setup(x => x.GetCitiesByNameAsync("Stockholm", "SE", It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResult);

            var handler = new GetCityByNameQueryHandler(mockClient.Object);

            //Act
            var result = await handler.Handle(new GetCityByNameQuery("Stockholm", "SE"), CancellationToken.None);

            //Assert
            Assert.That(result, Is.Not.Null);
        }
    }
}
