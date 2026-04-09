using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DashyBoard.Application.Interfaces;
using DashyBoard.Application.Queries.Poke.Dto;
using DashyBoard.Application.Queries.UserRelation.Dto;
using DashyBoard.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace DashyBoard.Infrastructure.Repositories
{
    public sealed class FriendRepository : IFriendRepository
    {
        private readonly DashyBoardDbContext _db;

        public FriendRepository(DashyBoardDbContext db)
        {
            _db = db;
        }

        // ========== COMMANDS: UserRelationship ==========

        public async Task<Guid> SendFriendRequestAsync(Guid currentUserId, string receiverUsername, CancellationToken ct)
        {
            var receiver = await _db.Users.FirstOrDefaultAsync(u => u.Username == receiverUsername, ct);
            if (receiver == null)
                throw new KeyNotFoundException($"User '{receiverUsername}' not found.");

            var receiverId = receiver.Id;

            var existingRelation = await GetRelationshipBetweenUsersAsync(currentUserId, receiverId, ct);

            if (existingRelation != null)
            {
                if (existingRelation.Status == UserRelationshipStatus.Blocked)
                    throw new InvalidOperationException("Cannot send friend request to blocked user.");

                if (existingRelation.Status == UserRelationshipStatus.Pending)
                    throw new InvalidOperationException("Friend request already sent.");

                if (existingRelation.Status == UserRelationshipStatus.Accepted)
                    throw new InvalidOperationException("Already friends.");
            }

            var relationship = new UserRelationship(currentUserId, receiverId, currentUserId);
            _db.UserRelationships.Add(relationship);
            await _db.SaveChangesAsync(ct);
            
            return relationship.Id;
        }

        public async Task AcceptFriendRequestAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct)
        {
            var relationship = await _db.UserRelationships.FindAsync(new object[] { relationshipId }, ct);

            if (relationship == null)
                throw new KeyNotFoundException("Friend request not found.");

            relationship.Accept(currentUserId);
            await _db.SaveChangesAsync(ct);
        }

        public async Task RejectFriendRequestAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct)
        {
            var relationship = await _db.UserRelationships.FindAsync(new object[] { relationshipId }, ct);

            if (relationship == null)
                throw new KeyNotFoundException("Friend request not found.");

            if (!relationship.IsPendingFor(currentUserId))
                throw new InvalidOperationException("Cannot reject this request.");

            _db.UserRelationships.Remove(relationship);
            await _db.SaveChangesAsync(ct);
        }

        public async Task RemoveFriendAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct)
        {
            var relationship = await _db.UserRelationships.FindAsync(new object[] { relationshipId }, ct);

            if (relationship == null)
                throw new KeyNotFoundException("Relationship not found.");

            if (!relationship.Involves(currentUserId))
                throw new InvalidOperationException("You are not part of this relationship.");

            if (relationship.Status != UserRelationshipStatus.Accepted)
                throw new InvalidOperationException("Cannot remove non-friend.");

            _db.UserRelationships.Remove(relationship);
            await _db.SaveChangesAsync(ct);
        }

        public async Task BlockUserAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct)
        {
            var relationship = await _db.UserRelationships.FindAsync(new object[] { relationshipId }, ct);

            if (relationship == null)
                throw new KeyNotFoundException("Relationship not found.");

            relationship.Block(currentUserId);
            await _db.SaveChangesAsync(ct);
        }

        public async Task UnblockUserAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct)
        {
            var relationship = await _db.UserRelationships.FindAsync(new object[] { relationshipId }, ct);

            if (relationship == null)
                throw new KeyNotFoundException("Relationship not found.");

            if (!relationship.Involves(currentUserId))
                throw new InvalidOperationException("You are not part of this relationship.");

            if (relationship.Status != UserRelationshipStatus.Blocked)
                throw new InvalidOperationException("User is not blocked.");

            _db.UserRelationships.Remove(relationship);
            await _db.SaveChangesAsync(ct);
        }

        // ========== QUERIES: UserRelationship ==========

        public async Task<IReadOnlyList<UserRelationDto>> GetFriendListAsync(Guid currentUserId, CancellationToken ct)
        {
            var friends = await _db.UserRelationships
                .Where(r => (r.User1Id == currentUserId || r.User2Id == currentUserId) && r.Status == UserRelationshipStatus.Accepted)
                .Select(r => new
                {
                    Relationship = r,
                    OtherUserId = r.User1Id == currentUserId ? r.User2Id : r.User1Id
                })
                .Join(_db.Users,
                    r => r.OtherUserId,
                    u => u.Id,
                    (r, u) => new UserRelationDto
                    {
                        UserId = u.Id,
                        Username = u.Username,
                        DisplayName = u.DisplayName,
                        Status = r.Relationship.Status,
                        IsFriend = true,
                        IsPending = false,
                        IsRequestedByCurrentUser = false,
                        IsIncomingRequest = false,
                        IsBlocked = false,
                        CanSendRequest = false,
                        CanAccept = false,
                        CanDecline = false,
                        CanRemoveFriend = true,
                        CanBlock = true,
                        CanUnblock = false
                    })
                .ToListAsync(ct);

            return friends;
        }

        public async Task<IReadOnlyList<UserRelationDto>> GetFriendRequestsAsync(Guid currentUserId, CancellationToken ct)
        {
            var requests = await _db.UserRelationships
                .Where(r => r.Status == UserRelationshipStatus.Pending && 
                           r.RequestedByUserId != currentUserId &&
                           (r.User1Id == currentUserId || r.User2Id == currentUserId))
                .Select(r => new
                {
                    Relationship = r,
                    OtherUserId = r.RequestedByUserId
                })
                .Join(_db.Users,
                    r => r.OtherUserId,
                    u => u.Id,
                    (r, u) => new UserRelationDto
                    {
                        UserId = u.Id,
                        Username = u.Username,
                        DisplayName = u.DisplayName,
                        Status = r.Relationship.Status,
                        IsFriend = false,
                        IsPending = true,
                        IsRequestedByCurrentUser = false,
                        IsIncomingRequest = true,
                        IsBlocked = false,
                        CanSendRequest = false,
                        CanAccept = true,
                        CanDecline = true,
                        CanRemoveFriend = false,
                        CanBlock = true,
                        CanUnblock = false
                    })
                .ToListAsync(ct);

            return requests;
        }

        public async Task<IReadOnlyList<UserRelationDto>> GetBlockedUsersAsync(Guid currentUserId, CancellationToken ct)
        {
            var blocked = await _db.UserRelationships
                .Where(r => (r.User1Id == currentUserId || r.User2Id == currentUserId) && r.Status == UserRelationshipStatus.Blocked)
                .Select(r => new
                {
                    Relationship = r,
                    OtherUserId = r.User1Id == currentUserId ? r.User2Id : r.User1Id
                })
                .Join(_db.Users,
                    r => r.OtherUserId,
                    u => u.Id,
                    (r, u) => new UserRelationDto
                    {
                        UserId = u.Id,
                        Username = u.Username,
                        DisplayName = u.DisplayName,
                        Status = r.Relationship.Status,
                        IsFriend = false,
                        IsPending = false,
                        IsRequestedByCurrentUser = false,
                        IsIncomingRequest = false,
                        IsBlocked = true,
                        CanSendRequest = false,
                        CanAccept = false,
                        CanDecline = false,
                        CanRemoveFriend = false,
                        CanBlock = false,
                        CanUnblock = true
                    })
                .ToListAsync(ct);

            return blocked;
        }

        public async Task<UserRelationDto?> GetFriendAsync(Guid currentUserId, string otherUsername, CancellationToken ct)
        {
            var otherUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == otherUsername, ct);
            if (otherUser == null)
                return null;

            var relationship = await GetRelationshipBetweenUsersAsync(currentUserId, otherUser.Id, ct);

            if (relationship == null)
            {
                return new UserRelationDto
                {
                    UserId = otherUser.Id,
                    Username = otherUser.Username,
                    DisplayName = otherUser.DisplayName,
                    Status = null,
                    IsFriend = false,
                    IsPending = false,
                    IsRequestedByCurrentUser = false,
                    IsIncomingRequest = false,
                    IsBlocked = false,
                    CanSendRequest = true,
                    CanAccept = false,
                    CanDecline = false,
                    CanRemoveFriend = false,
                    CanBlock = false,
                    CanUnblock = false
                };
            }

            var isRequestedByCurrentUser = relationship.RequestedByUserId == currentUserId;
            var isPending = relationship.Status == UserRelationshipStatus.Pending;
            var isAccepted = relationship.Status == UserRelationshipStatus.Accepted;
            var isBlocked = relationship.Status == UserRelationshipStatus.Blocked;

            return new UserRelationDto
            {
                UserId = otherUser.Id,
                Username = otherUser.Username,
                DisplayName = otherUser.DisplayName,
                Status = relationship.Status,
                IsFriend = isAccepted,
                IsPending = isPending,
                IsRequestedByCurrentUser = isPending && isRequestedByCurrentUser,
                IsIncomingRequest = isPending && !isRequestedByCurrentUser,
                IsBlocked = isBlocked,
                CanSendRequest = false,
                CanAccept = isPending && !isRequestedByCurrentUser,
                CanDecline = isPending && !isRequestedByCurrentUser,
                CanRemoveFriend = isAccepted,
                CanBlock = !isBlocked,
                CanUnblock = isBlocked
            };
        }

        // ========== COMMANDS: Poke ==========

        public async Task SendPokeAsync(Guid fromUserId, string toUsername, CancellationToken ct)
        {
            var toUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == toUsername, ct);
            if (toUser == null)
                throw new KeyNotFoundException($"User '{toUsername}' not found.");

            var relationship = await GetRelationshipBetweenUsersAsync(fromUserId, toUser.Id, ct);

            if (relationship == null || relationship.Status != UserRelationshipStatus.Accepted)
                throw new InvalidOperationException("You must be friends to send a poke.");

            var existingPoke = await _db.Pokes
                .Where(p => p.RelationshipId == relationship.Id && p.IsActive)
                .FirstOrDefaultAsync(ct);

            if (existingPoke != null)
                throw new InvalidOperationException("An active poke already exists.");

            var poke = new Domain.Models.Poke(relationship.Id, fromUserId, toUser.Id);
            _db.Pokes.Add(poke);
            await _db.SaveChangesAsync(ct);
        }

        public async Task MarkPokeAsSeenAsync(Guid pokeId, Guid currentUserId, CancellationToken ct)
        {
            var poke = await _db.Pokes.FindAsync(new object[] { pokeId }, ct);

            if (poke == null)
                throw new KeyNotFoundException("Poke not found.");

            if (poke.ToUserId != currentUserId)
                throw new InvalidOperationException("You can only mark your own pokes as seen.");

            poke.MarkAsSeen();
            await _db.SaveChangesAsync(ct);
        }

        public async Task InactivatePokeAsync(Guid pokeId, Guid currentUserId, CancellationToken ct)
        {
            var poke = await _db.Pokes.FindAsync(new object[] { pokeId }, ct);

            if (poke == null)
                throw new KeyNotFoundException("Poke not found.");

            if (poke.ToUserId != currentUserId)
                throw new InvalidOperationException("You can only dismiss your own pokes.");

            poke.Deactivate();
            await _db.SaveChangesAsync(ct);
        }

        // ========== QUERIES: Poke ==========

        public async Task<IReadOnlyList<PokeDto>> GetPokesAsync(Guid currentUserId, CancellationToken ct)
        {
            var pokes = await _db.Pokes
                .Where(p => p.ToUserId == currentUserId && p.IsActive)
                .Join(_db.Users,
                    p => p.FromUserId,
                    u => u.Id,
                    (p, u) => new PokeDto
                    {
                        Id = p.Id,
                        FromUserId = p.FromUserId,
                        FromUsername = u.Username,
                        ToUserId = p.ToUserId,
                        CreatedAtUtc = p.CreatedAtUtc,
                        IsSeen = p.SeenAtUtc != null,
                        IsActive = p.IsActive,
                        CanDismiss = true
                    })
                .OrderByDescending(p => p.CreatedAtUtc)
                .ToListAsync(ct);

            return pokes;
        }

        // ========== HELPER ==========

        private async Task<UserRelationship?> GetRelationshipBetweenUsersAsync(Guid user1Id, Guid user2Id, CancellationToken ct)
        {
            var smaller = user1Id.CompareTo(user2Id) < 0 ? user1Id : user2Id;
            var larger = user1Id.CompareTo(user2Id) < 0 ? user2Id : user1Id;

            return await _db.UserRelationships
                .FirstOrDefaultAsync(r => r.User1Id == smaller && r.User2Id == larger, ct);
        }
    }
}
