using System;
using System.Collections.Generic;
using System.Text;

namespace DashyBoard.Infrastructure.Configuration
{
    public sealed class SpotifyOptions
    {
        public const string SectionName = "Spotify";

        public string ClientId { get; init; } = string.Empty;
        public string ClientSecret { get; init; } = string.Empty;
        public string RedirectUri { get; init; } = string.Empty;

        public string FrontendCallbackUri { get; init; } = string.Empty;
    }
}
