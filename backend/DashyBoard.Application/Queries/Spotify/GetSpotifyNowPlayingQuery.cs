using DashyBoard.Application.Queries.Spotify.Dto;
using MediatR;

namespace DashyBoard.Application.Queries.Spotify
{
    public sealed record GetSpotifyNowPlayingQuery(Guid UserId) : IRequest<SpotifyNowPlayingDto?>;
}