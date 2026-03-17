using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Domain.Models;

namespace DashyBoard.Domain.Tests.Reminder
{
    public class WhenCreatingReminder
    {

        [Test]
        public void ThenShouldCreateReminder()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var dueAtUtc = DateTime.UtcNow.AddDays(1);


            // Act
            var reminder = new Models.Reminder(userId, "gym", dueAtUtc, "legday");

            // Assert
            Assert.That(reminder.UserId, Is.EqualTo(userId));
            Assert.That(reminder.Title, Is.EqualTo("gym"));
            Assert.That(reminder.DueAtUtc, Is.EqualTo(dueAtUtc));
            Assert.That(reminder.Note, Is.EqualTo("legday"));
            Assert.That(reminder.IsCompleted, Is.False);
        }
    }
}
