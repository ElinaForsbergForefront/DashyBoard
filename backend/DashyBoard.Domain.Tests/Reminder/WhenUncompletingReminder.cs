using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Domain.Models;

namespace DashyBoard.Domain.Tests.Reminder
{
    public class WhenUncompletingReminder
    {
        [Test]
        public void ThenShouldUncompleteReminder()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var dueAtUtc = DateTime.UtcNow.AddDays(1);
            var reminder = new Models.Reminder(userId, "gym", dueAtUtc, "legday");

            reminder.MarkCompleted();
            reminder.MarkUncompleted();
            // Act
            // Assert
            Assert.That(reminder.IsCompleted, Is.False);
        }
    }
}
