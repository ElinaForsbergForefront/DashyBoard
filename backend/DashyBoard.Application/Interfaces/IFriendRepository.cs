using System;
using System.Collections.Generic;
using System.Text;
using DashyBoard.Application.Queries.Poke.Dto;
using DashyBoard.Application.Queries.UserRelation.Dto;

namespace DashyBoard.Application.Interfaces
{
    public interface IFriendRepository
    {
        // UserRelationship Commands
        Task SendFriendRequestAsync(Guid currentUserId, string receiverUsername, CancellationToken ct);
        Task AcceptFriendRequestAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct);
        Task RejectFriendRequestAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct);
        Task RemoveFriendAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct);
        Task BlockUserAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct);
        Task UnblockUserAsync(Guid relationshipId, Guid currentUserId, CancellationToken ct);

        // UserRelationship Queries
        Task<IReadOnlyList<UserRelationDto>> GetFriendListAsync(Guid currentUserId, CancellationToken ct);
        Task<IReadOnlyList<UserRelationDto>> GetFriendRequestsAsync(Guid currentUserId, CancellationToken ct);
        Task<IReadOnlyList<UserRelationDto>> GetBlockedUsersAsync(Guid currentUserId, CancellationToken ct);
        Task<UserRelationDto?> GetFriendAsync(Guid currentUserId, string otherUsername, CancellationToken ct);

        // Poke Commands
        Task SendPokeAsync(Guid fromUserId, string toUsername, CancellationToken ct);
        Task MarkPokeAsSeenAsync(Guid pokeId, Guid currentUserId, CancellationToken ct);
        Task InactivatePokeAsync(Guid pokeId, Guid currentUserId, CancellationToken ct);

        // Poke Queries
        Task<IReadOnlyList<PokeDto>> GetPokesAsync(Guid currentUserId, CancellationToken ct);
    }
}
