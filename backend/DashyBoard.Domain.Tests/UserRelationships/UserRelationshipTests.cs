using DashyBoard.Domain.Models;

namespace DashyBoard.Domain.Tests.UserRelationships
{
    public class UserRelationshipTests
    {
        [Test]
        public void Create_WithValidData_SetsUser1AndUser2InCorrectOrder()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();
            
            var smaller = userId1.CompareTo(userId2) < 0 ? userId1 : userId2;
            var larger = userId1.CompareTo(userId2) < 0 ? userId2 : userId1;

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.User1Id, Is.EqualTo(smaller));
            Assert.That(relationship.User2Id, Is.EqualTo(larger));
        }

        [Test]
        public void Create_WithValidData_SetsRequestedByUserId()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.RequestedByUserId, Is.EqualTo(userId1));
        }

        [Test]
        public void Create_WithValidData_SetsStatusToPending()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.Status, Is.EqualTo(UserRelationshipStatus.Pending));
        }

        [Test]
        public void Create_WithValidData_GeneratesId()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.Id, Is.Not.EqualTo(Guid.Empty));
        }

        [Test]
        public void Create_WithSameUserId_ThrowsArgumentException()
        {
            var userId = Guid.NewGuid();

            Assert.Throws<ArgumentException>(() => 
                new UserRelationship(userId, userId, userId));
        }

        [Test]
        public void Create_WithInvalidRequestedByUserId_ThrowsArgumentException()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();
            var userId3 = Guid.NewGuid();

            Assert.Throws<ArgumentException>(() => 
                new UserRelationship(userId1, userId2, userId3));
        }

        [Test]
        public void Accept_WhenPending_ChangesStatusToAccepted()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            relationship.Accept(userId2);
            
            Assert.That(relationship.Status, Is.EqualTo(UserRelationshipStatus.Accepted));
        }

        [Test]
        public void Accept_WhenPending_SetsRespondedAtUtc()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            var before = DateTime.UtcNow;
            relationship.Accept(userId2);
            
            Assert.That(relationship.RespondedAtUtc, Is.Not.Null);
            Assert.That(relationship.RespondedAtUtc, Is.GreaterThanOrEqualTo(before));
        }

        [Test]
        public void Accept_ByRequester_ThrowsInvalidOperationException()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.Throws<InvalidOperationException>(() => relationship.Accept(userId1));
        }

        [Test]
        public void Accept_WhenNotPending_ThrowsInvalidOperationException()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            relationship.Accept(userId2);
            
            Assert.Throws<InvalidOperationException>(() => relationship.Accept(userId2));
        }

        [Test]
        public void Block_SetsStatusToBlocked()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            relationship.Block(userId2);
            
            Assert.That(relationship.Status, Is.EqualTo(UserRelationshipStatus.Blocked));
        }

        [Test]
        public void Block_SetsBlockedAtUtc()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            var before = DateTime.UtcNow;
            relationship.Block(userId2);
            
            Assert.That(relationship.BlockedAtUtc, Is.Not.Null);
            Assert.That(relationship.BlockedAtUtc, Is.GreaterThanOrEqualTo(before));
        }

        [Test]
        public void Involves_WithUser1_ReturnsTrue()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.Involves(userId1), Is.True);
        }

        [Test]
        public void Involves_WithUser2_ReturnsTrue()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.Involves(userId2), Is.True);
        }

        [Test]
        public void Involves_WithOtherUser_ReturnsFalse()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();
            var userId3 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.Involves(userId3), Is.False);
        }

        [Test]
        public void GetOtherUser_WithUser1_ReturnsUser2()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            var other = relationship.GetOtherUser(userId1);
            Assert.That(other, Is.EqualTo(userId2));
        }

        [Test]
        public void GetOtherUser_WithUser2_ReturnsUser1()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            var other = relationship.GetOtherUser(userId2);
            Assert.That(other, Is.EqualTo(userId1));
        }

        [Test]
        public void IsPendingFor_ForReceiver_ReturnsTrue()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.IsPendingFor(userId2), Is.True);
        }

        [Test]
        public void IsPendingFor_ForRequester_ReturnsFalse()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.IsPendingFor(userId1), Is.False);
        }

        [Test]
        public void IsRequestedBy_ForRequester_ReturnsTrue()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.IsRequestedBy(userId1), Is.True);
        }

        [Test]
        public void IsRequestedBy_ForReceiver_ReturnsFalse()
        {
            var userId1 = Guid.NewGuid();
            var userId2 = Guid.NewGuid();

            var relationship = new UserRelationship(userId1, userId2, userId1);
            
            Assert.That(relationship.IsRequestedBy(userId2), Is.False);
        }
    }
}