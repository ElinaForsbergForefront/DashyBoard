using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Commands.Reminders;
using DashyBoard.Application.Interfaces;
using Moq;


namespace DashyBoard.Application.Tests.Reminder
{
    public class WhenDeletingReminder
    {
        [Test]
        public async Task ThenShouldDeleteReminder()
        {
            // Arrange
            var reminderId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            var mock = new Mock<IReminderRepository>();
            mock
                .Setup(x => x.DeleteReminderAsync(reminderId, userId, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var handler = new DeleteReminderCommandHandler(mock.Object);
            var command = new DeleteReminderCommand(reminderId, userId);

            // Act
            await handler.Handle(command, CancellationToken.None);

            // Assert
            mock.Verify(x => x.DeleteReminderAsync(reminderId, userId, It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
