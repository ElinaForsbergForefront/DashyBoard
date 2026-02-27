using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Reminders;
using DashyBoard.Application.Queries.Reminders.Dto;
using Moq;
using NUnit.Framework;


namespace DashyBoard.Application.Tests.Reminder
{
    public class WhenGettingReminders
    {
        [Test]
        public async Task ThenValidRequestShouldReturnReminders()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var expectedReminders = new List<ReminderDto>
            {
                new ReminderDto(
                    Guid.NewGuid(),
                    userId,
                    "gym",
                    "legday",
                    DateTime.UtcNow.AddDays(1),
                    false,
                    DateTime.UtcNow,
                    null
                ),
                new ReminderDto(
                    Guid.NewGuid(),
                    userId,
                    "meeting",
                    "project sync",
                    DateTime.UtcNow.AddHours(5),
                    false,
                    DateTime.UtcNow,
                    null
                )
            };
            var mock = new Mock<IReminderRepository>();
            mock
               .Setup(x => x.GetMyRemindersAsync(userId, It.IsAny<CancellationToken>()))
               .ReturnsAsync(expectedReminders);

            var handler = new GetMyRemindersQueryHandler(mock.Object);
            var query = new GetMyRemindersQuery(userId);

             // Act
            var result = await handler.Handle(query, CancellationToken.None);
             // Assert
            Assert.That(result, Is.EqualTo(expectedReminders));
        }
    }
}
