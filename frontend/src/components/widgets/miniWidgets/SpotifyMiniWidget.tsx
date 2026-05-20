import { useEffect, useMemo, useState } from 'react';
import {
  useGetSpotifyNowPlayingQuery,
  useLazyGetSpotifyLoginUrlQuery,
} from '../../../api/endpoints/spotify';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassCard } from '../../ui/glass-card';

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1DB954] shrink-0">
      <path d="M12 0C5.37 0 0 5.373 0 12s5.37 12 12 12 12-5.373 12-12S18.63 0 12 0zm5.52 17.34a.75.75 0 0 1-1.03.25c-2.82-1.72-6.36-2.1-10.54-1.13a.75.75 0 1 1-.34-1.46c4.54-1.05 8.43-.61 11.64 1.31.36.22.47.68.27 1.03zm1.47-3.27a.94.94 0 0 1-1.3.31c-3.23-1.99-8.15-2.57-11.97-1.41a.94.94 0 1 1-.53-1.81c4.27-1.25 9.68-.61 13.49 1.64.44.27.58.85.31 1.27zm.13-3.41c-3.87-2.29-10.26-2.5-13.95-1.35a1.13 1.13 0 1 1-.67-2.16c4.24-1.32 11.3-1.06 15.7 1.51a1.13 1.13 0 0 1-1.08 2z" />
    </svg>
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
      <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/35 px-2.5 py-1.5 text-white backdrop-blur-md">
        <div className="flex gap-0.5">
          <span className="block h-3 w-1 rounded bg-white" />
          <span className="block h-3 w-1 rounded bg-white" />
        </div>
        <span className="text-[10px] font-medium tracking-wide">Paused</span>
      </div>
    </motion.div>
  );
}

export function SpotifyMiniWidget() {
  const [notConnected, setNotConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [displayProgressMs, setDisplayProgressMs] = useState(0);

  const { data, isLoading, isError, error, refetch } = useGetSpotifyNowPlayingQuery(undefined, {
    pollingInterval: notConnected ? 0 : 5_000,
    refetchOnFocus: !notConnected,
    refetchOnReconnect: true,
  });

  const [getLoginUrl] = useLazyGetSpotifyLoginUrlQuery();

  const status = (error as { status?: number } | undefined)?.status;

  useEffect(() => {
    if (isError && (status === 404 || status === 401)) {
      setNotConnected(true);
    } else if (!isError) {
      setNotConnected(false);
    }
  }, [isError, status]);

  useEffect(() => {
    if (!data) { setDisplayProgressMs(0); return; }
    setDisplayProgressMs(data.progressMs);
  }, [data]);

  useEffect(() => {
    if (!data?.isPlaying || !data.durationMs) return;
    const interval = window.setInterval(() => {
      setDisplayProgressMs((current) => {
        const next = current + 1000;
        return next > data.durationMs ? data.durationMs : next;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [data?.isPlaying, data?.durationMs, data?.trackName, data?.artistName]);

  const progressPercent = useMemo(() => {
    if (!data?.durationMs || data.durationMs <= 0) return 0;
    return Math.min((displayProgressMs / data.durationMs) * 100, 100);
  }, [displayProgressMs, data?.durationMs]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const result = await getLoginUrl().unwrap();
      const popup = window.open(
        result.url,
        'spotify-auth',
        `width=500,height=700,left=${window.screenX + (window.innerWidth - 500) / 2},top=${window.screenY + (window.innerHeight - 700) / 2}`,
      );
      if (!popup) { window.location.href = result.url; return; }
      const onMessage = (event: MessageEvent) => {
        if (event.origin === window.location.origin && event.data === 'spotify_connected') {
          window.removeEventListener('message', onMessage);
          setNotConnected(false);
          void refetch();
        }
      };
      window.addEventListener('message', onMessage);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center gap-1.5">
            <SpotifyLogo />
            <span className="text-xs font-semibold text-foreground">Spotify</span>
          </div>
          <p className="text-[10px] text-muted">…</p>
        </div>
      </GlassCard>
    );
  }

  if (notConnected) {
    return (
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col items-center justify-center gap-2 h-full">
          <SpotifyLogo />
          <button
            type="button"
            onClick={() => void handleConnect()}
            disabled={isConnecting}
            className="rounded px-2 py-0.5 text-[10px] bg-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/30 transition-colors disabled:opacity-50"
          >
            {isConnecting ? '…' : 'Anslut Spotify'}
          </button>
        </div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard className="glass-widget-mini w-full h-full">
        <div className="flex flex-col gap-1.5 h-full">
          <div className="flex items-center gap-1.5">
            <SpotifyLogo />
            <span className="text-xs font-semibold text-foreground">Spotify</span>
          </div>
          <p className="text-[10px] text-muted">Ingenting spelas</p>
        </div>
      </GlassCard>
    );
  }

  const trackKey = `${data.trackName}-${data.artistName}-${data.albumImageUrl}`;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 backdrop-blur-xl">
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
            src={data.albumImageUrl}
            alt={data.albumName}
            initial={{ opacity: 0, scale: 1.16 }}
            animate={{ opacity: 0.58, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative flex h-full flex-col justify-between p-3"
          >
            {/* Header */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <SpotifyLogo />
                {data.isPlaying && (
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#1DB954] animate-pulse" />
                )}
              </div>
              <span className="text-xs font-semibold text-white">Spotify</span>
            </div>

            {/* Track info + progress */}
            <div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">
                {data.trackName}
              </h3>
              <p className="line-clamp-1 text-[10px] text-white/80 mt-0.5">{data.artistName}</p>
              <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                <div
                  className="h-1 rounded-full bg-white transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </motion.div>

          <AnimatePresence>{!data.isPlaying && <PauseOverlay />}</AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
