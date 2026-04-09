using DashyBoard.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Application.Queries.UserRelation.Dto
{
    public sealed record UserRelationDto
    {
        public Guid UserId { get; init; }

        public string? Username { get; init; }
        public string? DisplayName { get; init; }

        public UserRelationshipStatus? Status { get; init; }

        public bool IsFriend { get; init; }
        public bool IsPending { get; init; }
        public bool IsRequestedByCurrentUser { get; init; }
        public bool IsIncomingRequest { get; init; }
        public bool IsBlocked { get; init; }

        public bool CanSendRequest { get; init; }
        public bool CanAccept { get; init; }
        public bool CanDecline { get; init; }
        public bool CanRemoveFriend { get; init; }
        public bool CanBlock { get; init; }
        public bool CanUnblock { get; init; }
    }
}
