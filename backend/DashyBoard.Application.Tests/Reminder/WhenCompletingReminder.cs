using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Commands.Reminders;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Reminders.Dto;
using Moq;
using NUnit.Framework;



namespace DashyBoard.Application.Tests.Reminder
{
    public class WhenCompletingReminder
    {
        [Test]
        public async Task ThenShouldMarkReminderAsCompleted()
        {
            // Arrange
            var reminderId = Guid.NewGuid();
            var userId = Guid.NewGuid();


            var mock = new Mock<IReminderRepository>();
            mock
                .Setup(x => x.MarkCompletedAsync(reminderId, userId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);


            var handler = new MarkReminderCompletedCommandHandler(mock.Object);
            var command = new MarkReminderCompletedCommand(reminderId, userId);


            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.MarkCompletedAsync(reminderId, userId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
