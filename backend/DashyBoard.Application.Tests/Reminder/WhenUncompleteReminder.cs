using DashyBoard.Application.Commands.Reminders;
using DashyBoard.Application.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Tests.Reminder
{
    public class WhenUncompleteReminder
    {
        [Test]
        public async Task ThenShouldMarkReminderAsIncomplete() 
        {
            // Arrange
            var reminderId = Guid.NewGuid();
            var userId = Guid.NewGuid();


            var mock = new Mock<IReminderRepository>();
            mock
                .Setup(x => x.MarkUncompletedAsync(reminderId, userId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);


            var handler = new MarkReminderUncompletedCommandHandler(mock.Object);
            var command = new MarkReminderUncompletedCommand(reminderId, userId);


            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.MarkUncompletedAsync(reminderId, userId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
