using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Domain.Models
{
    public sealed class Widget
    {
        public Guid Id { get; private set; }
        public string Type { get; private set; } = string.Empty;
        public double X { get; private set; }
        public double Y { get; private set; }

        public Widget(string type, double x, double y)
        {
            Id = Guid.NewGuid();
            Type = type;
            X = x;
            Y = y;
        }

        public void Move(double x, double y)
        {
            X = x;
            Y = y;
        }
    }
}
