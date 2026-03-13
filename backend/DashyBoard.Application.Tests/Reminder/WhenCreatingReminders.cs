using DashyBoard.Application.Commands.Reminders;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Reminders.Dto;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Tests.Reminder
{
    public class WhenCreatingReminders
    {
        [Test]
        public async Task ThenValidRequestShouldCreateReminder()
        {
            // Arrange
            var expectedReminder = new ReminderDto
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                Title = "gym",
                Note = "legday",
                DueAtUtc = DateTime.UtcNow.AddDays(1),
                IsCompleted = false,
                CreatedAtUtc = DateTime.UtcNow,
                CompletedAtUtc = null
            };
            var mock = new Mock<IReminderRepository>();

            mock
               .Setup(x => x.CreateReminderAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<DateTime>(), It.IsAny<CancellationToken>()))
               .ReturnsAsync(expectedReminder);

            var handler = new CreateReminderCommandHandler(mock.Object);

            var command = new CreateReminderCommand
            (
                userId: Guid.NewGuid(),
                title: "gym",
                dueAtUtc: DateTime.UtcNow.AddDays(1),
                note: "legday"
            );

             // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.That(result, Is.EqualTo(expectedReminder));
        }

    }
}
