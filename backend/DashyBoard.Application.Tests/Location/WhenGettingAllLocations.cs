using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Location;
using DashyBoard.Application.Queries.Location.Dto;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;


namespace DashyBoard.Application.Tests.Location
{
    public class WhenGettingAllLocations
    {


        [Test]
        public async Task ThenShouldReturnAllCountrys()
        {
            //Arrange
            var expectedResult = new List<CountryDto>
            {
                new CountryDto("Sweden",
                    "Stockholm",
                    "SE",
                    "https://restcountries.com/data/swe.svg"),
                new CountryDto("Norway",
                    "Oslo",
                    "NO",
                    "https://restcountries.com/data/nor.svg")
                };


            var mockClient = new Mock<ILocationApiClient>();
            mockClient
                .Setup(x => x.GetAllCountriesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedResult);

            var handler = new GetAllCountriesQueryHandler(mockClient.Object);

            //Act
            var result = await handler.Handle(new GetAllCountriesQuery(), CancellationToken.None);

            //Assert
            Assert.That(result, Is.EqualTo(expectedResult));

        }
    }
}
