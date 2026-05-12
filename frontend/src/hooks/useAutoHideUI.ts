import { useState, useRef, useCallback, useEffect } from 'react';

const HIDE_DELAY_MS = 3500;

export function useAutoHideUI(mirrorId: string | undefined) {
  const [uiVisible, setUiVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setUiVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setUiVisible(false), HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [mirrorId, resetHideTimer]);

  return { uiVisible, resetHideTimer };
}
