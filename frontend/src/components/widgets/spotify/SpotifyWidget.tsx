import { useEffect, useMemo, useState } from 'react';
import {
  useGetSpotifyNowPlayingQuery,
  useLazyGetSpotifyLoginUrlQuery,
} from '../../../api/endpoints/spotify';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassCard } from '../../ui/glass-card';

function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1DB954]">
      <path d="M12 0C5.37 0 0 5.373 0 12s5.37 12 12 12 12-5.373 12-12S18.63 0 12 0zm5.52 17.34a.75.75 0 0 1-1.03.25c-2.82-1.72-6.36-2.1-10.54-1.13a.75.75 0 1 1-.34-1.46c4.54-1.05 8.43-.61 11.64 1.31.36.22.47.68.27 1.03zm1.47-3.27a.94.94 0 0 1-1.3.31c-3.23-1.99-8.15-2.57-11.97-1.41a.94.94 0 1 1-.53-1.81c4.27-1.25 9.68-.61 13.49 1.64.44.27.58.85.31 1.27zm.13-3.41c-3.87-2.29-10.26-2.5-13.95-1.35a1.13 1.13 0 1 1-.67-2.16c4.24-1.32 11.3-1.06 15.7 1.51a1.13 1.13 0 0 1-1.08 2z" />
    </svg>
  );
}


function SpotifyHeader({ pulsing = false }: { pulsing?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <SpotifyLogo />
          {pulsing && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>

        <span className="text-lg font-semibold text-white">Spotify</span>
      </div>

    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
      <GlassCard className="glass-widget h-full w-full p-5">
      <div className="flex h-full w-full flex-col">{children}</div>
    </GlassCard>
  );
}

function LoadingState() {
  return (
    <CardShell>
      <SpotifyHeader />

      <div className="mt-6 w-full animate-pulse space-y-4">
        <div className="h-32 rounded-2xl bg-white/10" />
        <div className="h-7 w-3/4 rounded bg-white/10" />
        <div className="h-5 w-1/2 rounded bg-white/10" />
        <div className="h-2 w-full rounded-full bg-white/10" />
      </div>
    </CardShell>
  );
}

function ConnectState({
  onConnect,
  isConnecting,
}: {
  onConnect: () => Promise<void>;
  isConnecting: boolean;
}) {
  return (
    <CardShell>
      <SpotifyHeader />

      <div className="flex h-[calc(100%-40px)] flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-semibold text-white">Connect Spotify</h3>
        <p className="mt-2 max-w-[220px] text-sm text-white/60">
          Link your Spotify account to see what&apos;s playing
        </p>

        <button
          onClick={() => void onConnect()}
          disabled={isConnecting}
          className="mt-6 rounded-xl bg-[#214e87] px-6 py-2 text-white transition hover:bg-[#2a5f9f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConnecting ? 'Connecting...' : 'Connect Spotify'}
        </button>
      </div>
    </CardShell>
  );
}

function EmptyState() {
  return (
    <CardShell>
      <SpotifyHeader />

      <div className="flex h-[calc(100%-40px)] items-center justify-center text-center">
        <div>
          <h3 className="text-2xl font-semibold text-white">
            Nothing playing right now
          </h3>
          <p className="mt-2 text-sm text-white/60">
            Open Spotify to start playing music
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function PauseOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-white backdrop-blur-md">
        <div className="flex gap-1">
          <span className="block h-5 w-1.5 rounded bg-white" />
          <span className="block h-5 w-1.5 rounded bg-white" />
        </div>
        <span className="text-sm font-medium tracking-wide">Paused</span>
      </div>
    </motion.div>
  );
}

function SpotifyNowPlayingState({
  trackName,
  artistName,
  albumName,
  albumImageUrl,
  durationMs,
  displayProgressMs,
  isPlaying,
}: {
  trackName: string;
  artistName: string;
  albumName: string;
  albumImageUrl: string;
  durationMs: number;
  displayProgressMs: number;
  isPlaying: boolean;
}) {
  const progressPercent = useMemo(() => {
    if (!durationMs || durationMs <= 0) {
      return 0;
    }

    return Math.min((displayProgressMs / durationMs) * 100, 100);
  }, [displayProgressMs, durationMs]);

  const trackKey = `${trackName}-${artistName}-${albumImageUrl}`;

  return (
    <div className="relative h-[270px] w-[270px] overflow-hidden rounded-[28px] border border-white/10 bg-black/30 backdrop-blur-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={trackKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.img
            key={`${trackKey}-image`}
            src={albumImageUrl}
            alt={albumName}
            initial={{ opacity: 0, scale: 1.16 }}
            animate={{ opacity: 0.58, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative flex h-full flex-col justify-between p-5"
          >
            <SpotifyHeader pulsing={isPlaying} />

            <div>
              <div className="mb-4">
                <h3 className="line-clamp-2 text-[26px] font-semibold leading-tight text-white">
                  {trackName}
                </h3>

                <p className="mt-1 line-clamp-1 text-lg text-white/80">
                  {artistName}
                </p>
              </div>

              <div className="mb-2 h-1.5 w-full rounded-full bg-white/20">
                <div
                  className="h-1.5 rounded-full bg-white transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{formatMs(displayProgressMs)}</span>
                <span>{formatMs(durationMs)}</span>
              </div>
            </div>
          </motion.div>


          <AnimatePresence>{!isPlaying && <PauseOverlay />}</AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SpotifyWidget() {
  const [notConnected, setNotConnected] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSpotifyNowPlayingQuery(undefined, {
    pollingInterval: notConnected ? 0 : 5000,
    refetchOnFocus: !notConnected,
    refetchOnReconnect: true,
  });

  const [getLoginUrl, { isFetching: isConnecting }] =
    useLazyGetSpotifyLoginUrlQuery();

  const [displayProgressMs, setDisplayProgressMs] = useState(0);

  useEffect(() => {
    if (!data) {
      setDisplayProgressMs(0);
      return;
    }

    setDisplayProgressMs(data.progressMs);
  }, [data]);

  useEffect(() => {
    if (!data?.isPlaying || !data.durationMs) {
      return;
    }

    const interval = window.setInterval(() => {
      setDisplayProgressMs((current) => {
        const next = current + 1000;
        return next > data.durationMs ? data.durationMs : next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [data?.isPlaying, data?.durationMs, data?.trackName, data?.artistName]);

  const handleConnect = async () => {
    const result = await getLoginUrl().unwrap();

    const popup = window.open(
      result.url,
      'spotify-auth',
      'width=500,height=700,left=' +
        (window.screenX + (window.innerWidth - 500) / 2) +
        ',top=' +
        (window.screenY + (window.innerHeight - 700) / 2),
    );

    if (!popup) {
      // Fallback if popup was blocked
      window.location.href = result.url;
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data === 'spotify_connected'
      ) {
        window.removeEventListener('message', onMessage);
        setNotConnected(false);
        void refetch();
      }
    };

    window.addEventListener('message', onMessage);
  };

  const status = (error as { status?: number } | undefined)?.status;

  useEffect(() => {
    if (isError && (status === 404 || status === 401)) {
      setNotConnected(true);
    } else if (!isError) {
      setNotConnected(false);
    }
  }, [isError, status]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError && (status === 404 || status === 401)) {
    return (
      <ConnectState onConnect={handleConnect} isConnecting={isConnecting} />
    );
  }

  if (!data) {
    return <EmptyState />;
  }

  return (
    <SpotifyNowPlayingState
      trackName={data.trackName}
      artistName={data.artistName}
      albumName={data.albumName}
      albumImageUrl={data.albumImageUrl}
      durationMs={data.durationMs}
      displayProgressMs={displayProgressMs}
      isPlaying={data.isPlaying}
    />
  );
}