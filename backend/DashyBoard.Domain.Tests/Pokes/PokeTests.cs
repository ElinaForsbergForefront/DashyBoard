using DashyBoard.Domain.Models;

namespace DashyBoard.Domain.Tests.Pokes
{
    public class PokeTests
    {
        [Test]
        public void Create_WithValidData_SetsFromUserId()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            
            Assert.That(poke.FromUserId, Is.EqualTo(fromUserId));
        }

        [Test]
        public void Create_WithValidData_SetsToUserId()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            
            Assert.That(poke.ToUserId, Is.EqualTo(toUserId));
        }

        [Test]
        public void Create_WithValidData_SetsRelationshipId()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            
            Assert.That(poke.RelationshipId, Is.EqualTo(relationshipId));
        }

        [Test]
        public void Create_WithValidData_GeneratesId()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            
            Assert.That(poke.Id, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void Create_WithValidData_SetsIsActiveToTrue()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            
            Assert.That(poke.IsActive, Is.True);
        }

        [Test]
        public void Create_WithValidData_SetsCreatedAtUtc()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var before = DateTime.UtcNow;
            var poke = new Poke(relationshipId, fromUserId, toUserId);
            
            Assert.That(poke.CreatedAtUtc, Is.GreaterThanOrEqualTo(before));
        }

        [Test]
        public void Create_WithSameUserId_ThrowsArgumentException()
        {
            var relationshipId = Guid.NewGuid();
            var userId = Guid.NewGuid();

            Assert.Throws<ArgumentException>(() => 
                new Poke(relationshipId, userId, userId));
        }

        [Test]
        public void MarkAsSeen_SetsSeenAtUtc()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            var before = DateTime.UtcNow;
            poke.MarkAsSeen();
            
            Assert.That(poke.SeenAtUtc, Is.Not.Null);
            Assert.That(poke.SeenAtUtc, Is.GreaterThanOrEqualTo(before));
        }

        [Test]
        public void MarkAsSeen_WhenAlreadySeen_DoesNotChangeSeenAtUtc()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            poke.MarkAsSeen();
            var firstSeenAt = poke.SeenAtUtc;
            
            poke.MarkAsSeen();
            
            Assert.That(poke.SeenAtUtc, Is.EqualTo(firstSeenAt));
        }

        [Test]
        public void Deactivate_SetsIsActiveToFalse()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            poke.Deactivate();
            
            Assert.That(poke.IsActive, Is.False);
        }

        [Test]
        public void Deactivate_WhenAlreadyInactive_DoesNothing()
        {
            var relationshipId = Guid.NewGuid();
            var fromUserId = Guid.NewGuid();
            var toUserId = Guid.NewGuid();

            var poke = new Poke(relationshipId, fromUserId, toUserId);
            poke.Deactivate();
            poke.Deactivate();
            
            Assert.That(poke.IsActive, Is.False);
        }
    }
}