namespace DashyBoard.Application.Utilities;

public static class UnixTimestampConverter
{
    private static readonly DateTime UnixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static long ToUnixTimestamp(DateTime dateTimeUtc)
    {
        if (dateTimeUtc.Kind != DateTimeKind.Utc)
            throw new ArgumentException("DateTime must be in UTC.", nameof(dateTimeUtc));

        return (long)(dateTimeUtc - UnixEpoch).TotalSeconds;
    }

    public static DateTime FromUnixTimestamp(long timestamp)
    {
        return UnixEpoch.AddSeconds(timestamp);
    }

    public static long CreateTimestamp(int year, int month, int day, int hour = 0, int minute = 0, int second = 0)
    {
        var dateTime = new DateTime(year, month, day, hour, minute, second, DateTimeKind.Utc);
        return ToUnixTimestamp(dateTime);
    }
}
