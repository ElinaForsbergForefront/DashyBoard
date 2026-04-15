namespace DashyBoard.Application.Queries.Poke.Dto
{
    public sealed record PokeDto
    {
        public Guid Id { get; init; }

        public Guid FromUserId { get; init; }
        public string? FromUsername { get; init; }

        public Guid ToUserId { get; init; }

        public DateTime CreatedAtUtc { get; init; }

        public bool IsSeen { get; init; }
        public bool IsActive { get; init; }
        public bool CanDismiss { get; init; }
    }
}
