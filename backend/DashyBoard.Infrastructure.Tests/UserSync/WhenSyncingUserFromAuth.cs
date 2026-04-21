using DashyBoard.Domain.Models;
using DashyBoard.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace DashyBoard.Infrastructure.Tests.Services;

public class WhenSyncingUserFromAuth
{
    private DashyBoardDbContext _dbContext;
    private Mock<ILogger<UserSyncService>> _loggerMock;
    private UserSyncService _service;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<DashyBoardDbContext>()
            .UseInMemoryDatabase($"TestDb_{Guid.NewGuid()}")
            .Options;
        _dbContext = new DashyBoardDbContext(options);

        _loggerMock = new Mock<ILogger<UserSyncService>>();
        _service = new UserSyncService(_dbContext, _loggerMock.Object);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.Database.EnsureDeleted();
        _dbContext.Dispose();
    }

    [Test]
    public async Task Then_Creates_New_User_When_Not_Exists()
    {
        // Arrange
        var authSub = "auth0|new-user-123";
        var email = "newuser@test.com";

        // Act
        await _service.SyncUserFromAuthAsync(authSub, email, "testuser", "Test User", "Sweden", "Stockholm");

        // Assert
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.AuthSub == authSub);
        Assert.That(user, Is.Not.Null);
        Assert.That(user.Email, Is.EqualTo(email));
        Assert.That(user.Username, Is.EqualTo("testuser"));
        Assert.That(user.DisplayName, Is.EqualTo("Test User"));
        Assert.That(user.Country, Is.EqualTo("Sweden"));
        Assert.That(user.City, Is.EqualTo("Stockholm"));
    }

    [Test]
    public async Task Then_Updates_Existing_User_Without_Username()
    {
        // Arrange
        var authSub = "auth0|existing-user-456";
        var email = "existing@test.com";

        // Create user without username
        _dbContext.Users.Add(new User(authSub, email, null, null, null, null));
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.SyncUserFromAuthAsync(authSub, email, "updateduser", "Updated User", "Norway", "Oslo");

        // Assert
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.AuthSub == authSub);
        Assert.That(user, Is.Not.Null);
        Assert.That(user.Username, Is.EqualTo("updateduser"));
        Assert.That(user.DisplayName, Is.EqualTo("Updated User"));
        Assert.That(user.Country, Is.EqualTo("Norway"));
        Assert.That(user.City, Is.EqualTo("Oslo"));
    }

    [Test]
    public async Task Then_Does_Not_Modify_User_With_Existing_Username()
    {
        // Arrange
        var authSub = "auth0|synced-user-789";
        var email = "synced@test.com";

        // Create user with username already set
        _dbContext.Users.Add(new User(authSub, email, "existinguser", "Existing User", "Finland", "Helsinki"));
        await _dbContext.SaveChangesAsync();

        // Act
        await _service.SyncUserFromAuthAsync(authSub, email, "newusername", "New Name", "Denmark", "Copenhagen");

        // Assert - Should NOT be updated because username already exists
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.AuthSub == authSub);
        Assert.That(user, Is.Not.Null);
        Assert.That(user.Username, Is.EqualTo("existinguser")); // Not changed
        Assert.That(user.DisplayName, Is.EqualTo("Existing User")); // Not changed
        Assert.That(user.Country, Is.EqualTo("Finland")); // Not changed
        Assert.That(user.City, Is.EqualTo("Helsinki")); // Not changed
    }

    [Test]
    public async Task Then_Handles_Null_Metadata_Gracefully()
    {
        // Arrange
        var authSub = "auth0|no-metadata-user";
        var email = "nometadata@test.com";

        // Act
        await _service.SyncUserFromAuthAsync(authSub, email, null, null, null, null);

        // Assert
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.AuthSub == authSub);
        Assert.That(user, Is.Not.Null);
        Assert.That(user.Email, Is.EqualTo(email));
        Assert.That(user.Username, Is.Null);
        Assert.That(user.DisplayName, Is.Null);
        Assert.That(user.Country, Is.Null);
        Assert.That(user.City, Is.Null);
    }

    [Test]
    public async Task Then_Does_Not_Update_When_Metadata_Has_No_Username()
    {
        // Arrange
        var authSub = "auth0|partial-user";
        var email = "partial@test.com";

        // Create user without username
        _dbContext.Users.Add(new User(authSub, email, null, "Old Name", "Germany", "Berlin"));
        await _dbContext.SaveChangesAsync();

        // Act - metadata has displayName but no username
        await _service.SyncUserFromAuthAsync(authSub, email, null, "New Name", "Spain", "Madrid");

        // Assert - Should NOT be updated because metadata has no username
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.AuthSub == authSub);
        Assert.That(user, Is.Not.Null);
        Assert.That(user.Username, Is.Null);
        Assert.That(user.DisplayName, Is.EqualTo("Old Name")); // Not updated
        Assert.That(user.Country, Is.EqualTo("Germany")); // Not updated
        Assert.That(user.City, Is.EqualTo("Berlin")); // Not updated
    }
}