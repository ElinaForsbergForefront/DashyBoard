using DashyBoard.Domain.Models;

namespace DashyBoard.Domain.Tests.Mirrors;

public class MirrorTests
{
    [Test]
    public void Create_WithValidData_SetsUserId()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        Assert.That(mirror.UserId, Is.EqualTo("auth0|123"));
    }

    [Test]
    public void Create_WithValidData_SetsName()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        Assert.That(mirror.Name, Is.EqualTo("My Mirror"));
    }

    [Test]
    public void Create_WithValidData_SetsDimensions()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        Assert.That(mirror.WidthCm, Is.EqualTo(100));
        Assert.That(mirror.HeightCm, Is.EqualTo(50));
    }

    [Test]
    public void Create_WithValidData_GeneratesId()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        Assert.That(mirror.Id, Is.Not.EqualTo(Guid.Empty));
    }

    [Test]
    public void Create_WithValidData_SetsCreatedAt()
    {
        var before = DateTime.UtcNow;
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        Assert.That(mirror.CreatedAt, Is.GreaterThanOrEqualTo(before));
    }

    [Test]
    public void Update_WithValidData_UpdatesFields()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        mirror.Update("Updated Mirror", 200, 75);
        Assert.That(mirror.Name, Is.EqualTo("Updated Mirror"));
        Assert.That(mirror.WidthCm, Is.EqualTo(200));
        Assert.That(mirror.HeightCm, Is.EqualTo(75));
    }

    [Test]
    public void Update_DoesNotChangeId()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        var originalId = mirror.Id;
        mirror.Update("Updated Mirror", 200, 75);
        Assert.That(mirror.Id, Is.EqualTo(originalId));
    }

    [Test]
    public void Update_DoesNotChangeUserId()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        mirror.Update("Updated Mirror", 200, 75);
        Assert.That(mirror.UserId, Is.EqualTo("auth0|123"));
    }

    [Test]
    public void Update_DoesNotChangeCreatedAt()
    {
        var mirror = new Mirror("auth0|123", "My Mirror", 100, 50);
        var originalCreatedAt = mirror.CreatedAt;
        mirror.Update("Updated Mirror", 200, 75);
        Assert.That(mirror.CreatedAt, Is.EqualTo(originalCreatedAt));
    }
}
