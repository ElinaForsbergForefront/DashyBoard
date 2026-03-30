using DashyBoard.Application.Utilities;
using FluentAssertions;
using NUnit.Framework;

namespace DashyBoard.Application.Tests.Utilities;

public class WhenConvertingUnixTimestamps
{
    [Test]
    public void ShouldConvertUtcDateTime_ToUnixTimestamp()
    {
        // Arrange
        var dateTime = new DateTime(2024, 1, 15, 10, 30, 0, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(dateTime);

        // Assert
        timestamp.Should().Be(1705314600);
    }

    [Test]
    public void ShouldConvertUnixEpoch_ToZero()
    {
        // Arrange
        var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(epoch);

        // Assert
        timestamp.Should().Be(0);
    }

    [Test]
    public void ShouldThrowArgumentException_WhenDateTimeNotUtc()
    {
        // Arrange
        var localDateTime = new DateTime(2026, 3, 30, 12, 30, 45, DateTimeKind.Local);

        // Act
        var act = () => UnixTimestampConverter.ToUnixTimestamp(localDateTime);

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*must be in UTC*");
    }

    [Test]
    public void ShouldConvertUnixTimestamp_ToUtcDateTime()
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
        dateTime.Second.Should().Be(0);
        dateTime.Kind.Should().Be(DateTimeKind.Utc);
    }

    [Test]
    public void ShouldConvertZeroTimestamp_ToUnixEpoch()
    {
        // Act
        var dateTime = UnixTimestampConverter.FromUnixTimestamp(0);

        // Assert
        dateTime.Should().Be(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc));
    }

    [Test]
    public void ShouldCreateTimestamp_FromDateComponents()
    {
        // Act
        var timestamp = UnixTimestampConverter.CreateTimestamp(2024, 1, 15, 10, 30, 0);

        // Assert
        timestamp.Should().Be(1705314600);
    }

    [Test]
    public void ShouldCreateTimestamp_WithDefaultTimeComponents()
    {
        // Act
        var timestamp = UnixTimestampConverter.CreateTimestamp(2024, 1, 15);

        // Assert
        var dateTime = UnixTimestampConverter.FromUnixTimestamp(timestamp);
        dateTime.Hour.Should().Be(0);
        dateTime.Minute.Should().Be(0);
        dateTime.Second.Should().Be(0);
    }

    [Test]
    public void ShouldBeReversible_ToUnixAndBack()
    {
        // Arrange
        var original = new DateTime(2024, 6, 15, 14, 45, 30, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(original);
        var result = UnixTimestampConverter.FromUnixTimestamp(timestamp);

        // Assert
        result.Should().Be(original);
    }

    [Test]
    public void ShouldHandleFutureDate()
    {
        // Arrange
        var futureDate = new DateTime(2030, 12, 31, 23, 59, 59, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(futureDate);
        var result = UnixTimestampConverter.FromUnixTimestamp(timestamp);

        // Assert
        result.Should().Be(futureDate);
        timestamp.Should().BeGreaterThan(0);
    }

    [Test]
    public void ShouldHandlePastDate()
    {
        // Arrange - Date in 2000
        var pastDate = new DateTime(2000, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // Act
        var timestamp = UnixTimestampConverter.ToUnixTimestamp(pastDate);
        var result = UnixTimestampConverter.FromUnixTimestamp(timestamp);

        // Assert
        result.Should().Be(pastDate);
        timestamp.Should().Be(946684800);
    }
}