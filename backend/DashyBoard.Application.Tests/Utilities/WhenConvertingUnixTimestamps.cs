using DashyBoard.Application.Utilities;
using FluentAssertions;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Utilities;

public class WhenConvertingUnixTimestamps
{
    [Test]
    public void Then_Converts_UtcDateTime_To_UnixTimestamp()
    {
        // Arrange
        var dateTime = new DateTime(2024, 1, 15, 10, 30, 0, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(dateTime);

        // Assert
        timestamp.Should().Be(1705314600);
    }

    [Test]
    public void Then_Converts_UnixTimestamp_To_UtcDateTime()
    {
        // Arrange
        long timestamp = 1705314600; // 2024-01-15 10:30:00 UTC

        // Act
        var dateTime = UnixTimestampConverter.FromUnixTimestamp(timestamp);

        // Assert
        dateTime.Year.Should().Be(2024);
        dateTime.Month.Should().Be(1);
        dateTime.Day.Should().Be(15);
        dateTime.Hour.Should().Be(10);
        dateTime.Minute.Should().Be(30);
        dateTime.Kind.Should().Be(DateTimeKind.Utc);
    }

    [Test]
    public void Then_Roundtrip_Conversion_Is_Reversible()
    {
        // Arrange
        var original = new DateTime(2024, 6, 15, 14, 45, 30, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(original);
        var result = UnixTimestampConverter.FromUnixTimestamp(timestamp);

        // Assert
        result.Should().Be(original);
    }
}