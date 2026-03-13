using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.Reminders.Dto
{
    public sealed record ReminderDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = null!;
        public string? Note { get; set; }
        public DateTime DueAtUtc { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime? CompletedAtUtc { get; set; }
    }
}
