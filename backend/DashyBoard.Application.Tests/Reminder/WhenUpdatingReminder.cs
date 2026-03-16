using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Domain.Models;
using DashyBoard.Domain;

namespace DashyBoard.Application.Tests.Reminder
{
    public class WhenUpdatingReminder
    {
        [Test]
        public void ThenShouldUpdateReminder()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var dueAtUtc = DateTime.UtcNow.AddDays(1);
            var reminder = new Domain.Models.Reminder(userId, "gym", dueAtUtc, "legday");

            // Act
            reminder.Update("workout", DateTime.UtcNow.AddDays(2), "armday");

            // Assert
            Assert.That(reminder.Title, Is.EqualTo("workout"));
            Assert.That(reminder.Note, Is.EqualTo("armday"));
        }
    }
}
