using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location;
using DashyBoard.Application.Queries.Location.Dto;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Tests.Location
{
    public class WhenGettingCountryByName
    {
        [Test]
        public async Task ThenShouldReturnCountry()
        {
            //Arrange
            var expectedResult = new List<CountryDto>
                {
                    new CountryDto("Sweden",
                        "Stockholm",
                        "SE",
                        "https://restcountries.com/data/swe.svg")
                };

                        var mockClient = new Mock<ILocationApiClient>();
            mockClient.Setup(x => x.GetCountryByNameAsync("Sweden", It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResult);

            var handler = new GetCountryByNameQueryHandler(mockClient.Object);

            //Act
            var result = await handler.Handle(new GetCountryByNameQuery("Sweden"), CancellationToken.None);

            //Assert
            Assert.That(result, Is.Not.Null);

        }
    }
}
