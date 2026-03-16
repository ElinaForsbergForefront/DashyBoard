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
                new ReminderDto
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Title = "gym",
                    Note = "legday",
                    DueAtUtc = DateTime.UtcNow.AddDays(1),
                    IsCompleted = false,
                    CreatedAtUtc = DateTime.UtcNow,
                    CompletedAtUtc = null
                },
                new ReminderDto
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    Title = "meeting",
                    Note = "project sync",
                    DueAtUtc = DateTime.UtcNow.AddHours(5),
                    IsCompleted = false,
                    CreatedAtUtc = DateTime.UtcNow,
                    CompletedAtUtc = null
                }
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
