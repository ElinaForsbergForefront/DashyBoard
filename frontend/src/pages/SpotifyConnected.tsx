import { useEffect } from 'react';

export function SpotifyConnected() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage('spotify_connected', window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-white">
      <p>Spotify connected! You can close this window.</p>
    </div>
  );
}
