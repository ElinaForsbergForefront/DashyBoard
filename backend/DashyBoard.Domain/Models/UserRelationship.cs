namespace DashyBoard.Domain.Models;

public class UserRelationship
{
    public Guid Id { get; private set; }

    public Guid User1Id { get; private set; }
    public Guid User2Id { get; private set; }

    public Guid RequestedByUserId { get; private set; }
    public Guid ActionByUserId { get; private set; }

    public UserRelationshipStatus Status { get; private set; }

    public DateTime CreatedAtUtc { get; private set; }
    public DateTime UpdatedAtUtc { get; private set; }
    public DateTime? RespondedAtUtc { get; private set; }
    public DateTime? BlockedAtUtc { get; private set; }

    private UserRelationship() { }

    public UserRelationship(Guid userAId, Guid userBId, Guid requestedByUserId)
    {
        if (userAId == userBId)
            throw new ArgumentException("A user cannot have a relationship with themselves.");

        if (requestedByUserId != userAId && requestedByUserId != userBId)
            throw new ArgumentException("RequestedByUserId must belong to one of the users.");

        Id = Guid.NewGuid();

        if (userAId.CompareTo(userBId) < 0)
        {
            User1Id = userAId;
            User2Id = userBId;
        }
        else
        {
            User1Id = userBId;
            User2Id = userAId;
        }

        RequestedByUserId = requestedByUserId;
        ActionByUserId = requestedByUserId;
        Status = UserRelationshipStatus.Pending;

        CreatedAtUtc = DateTime.UtcNow;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void Accept(Guid actionByUserId)
    {
        if (Status != UserRelationshipStatus.Pending)
            throw new InvalidOperationException("Cannot accept a non-pending request.");

        if (!Involves(actionByUserId))
            throw new InvalidOperationException("User is not part of this relationship.");

        if (RequestedByUserId == actionByUserId)
            throw new InvalidOperationException("Requester cannot accept their own request.");

        Status = UserRelationshipStatus.Accepted;
        ActionByUserId = actionByUserId;
        RespondedAtUtc = DateTime.UtcNow;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void Block(Guid actionByUserId)
    {
        if (!Involves(actionByUserId))
            throw new InvalidOperationException("User is not part of this relationship.");

        Status = UserRelationshipStatus.Blocked;
        ActionByUserId = actionByUserId;
        BlockedAtUtc = DateTime.UtcNow;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public bool IsPendingFor(Guid userId)
        => Status == UserRelationshipStatus.Pending && RequestedByUserId != userId;

    public bool IsRequestedBy(Guid userId)
        => Status == UserRelationshipStatus.Pending && RequestedByUserId == userId;

    public bool Involves(Guid userId)
        => User1Id == userId || User2Id == userId;

    public Guid GetOtherUser(Guid userId)
    {
        if (User1Id == userId) return User2Id;
        if (User2Id == userId) return User1Id;

        throw new InvalidOperationException("User not part of relationship.");
    }
}

public enum UserRelationshipStatus
{
    Pending = 1,
    Accepted = 2,
    Blocked = 3
}