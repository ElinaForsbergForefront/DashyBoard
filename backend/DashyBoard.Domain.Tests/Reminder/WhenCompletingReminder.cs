using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Domain.Tests.Reminder
{
    public class WhenCompletingReminder
    {
        [Test]
        public void ThenShouldMarkReminderAsCompleted() 
        { 
            var reminder = new Models.Reminder(
                Guid.NewGuid(),
                "run", 
                DateTime.UtcNow.AddDays(1), 
                null
            );
            
            reminder.MarkCompleted(); 
            
            Assert.That(reminder.IsCompleted, Is.True); 
            Assert.That(reminder.CompletedAtUtc, Is.Not.Null); 
        }
    }
}
