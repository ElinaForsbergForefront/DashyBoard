using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Domain.Models
{
    public class Reminder
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }

        public string Title { get; private set; } = string.Empty;
        public string? Note { get; private set; }

        public DateTime DueAtUtc { get; private set; }

        public bool IsCompleted { get; private set; }
        public DateTime CreatedAtUtc { get; private set; }
        public DateTime? CompletedAtUtc { get; private set; }

        private Reminder() { } 

        public Reminder(Guid userId, string title, DateTime dueAtUtc, string? note = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required.", nameof(title));

            Id = Guid.NewGuid();
            UserId = userId;
            Title = title.Trim();
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
            DueAtUtc = dueAtUtc;
            CreatedAtUtc = DateTime.UtcNow;
            IsCompleted = false;
        }

        public void Update(string title, DateTime dueAtUtc, string? note = null)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Title is required.", nameof(title));

            Title = title.Trim();
            Note = string.IsNullOrWhiteSpace(note) ? null : note.Trim();
            DueAtUtc = dueAtUtc;
        }

        public void MarkCompleted()
        {
            if (IsCompleted) return;

            IsCompleted = true;
            CompletedAtUtc = DateTime.UtcNow;
        }

        public void MarkUncompleted()
        {
            IsCompleted = false;
            CompletedAtUtc = null;
        }
    }
}