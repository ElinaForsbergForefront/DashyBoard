namespace DashyBoard.Domain.Models;

public class Poke
{
    public Guid Id { get; private set; }

    public Guid RelationshipId { get; private set; }

    public Guid FromUserId { get; private set; }
    public Guid ToUserId { get; private set; }

    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? SeenAtUtc { get; private set; }
    public bool IsActive { get; private set; }

    private Poke() { }

    public Poke(Guid relationshipId, Guid fromUserId, Guid toUserId)
    {
        if (fromUserId == toUserId)
            throw new ArgumentException("Cannot poke yourself.");

        Id = Guid.NewGuid();
        RelationshipId = relationshipId;
        FromUserId = fromUserId;
        ToUserId = toUserId;

        CreatedAtUtc = DateTime.UtcNow;
        IsActive = true;
    }

    public void MarkAsSeen()
    {
        if (SeenAtUtc is not null) return;

        SeenAtUtc = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        if (!IsActive) return;

        IsActive = false;
    }
}