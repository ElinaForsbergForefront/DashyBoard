import { useEffect, useRef, useState } from 'react';

const MAX_SCALE = 30;
const PADDING = 32;

// Snap scale so that MINOR_GRID_CM (5) * scale is always a whole number,
// preventing sub-pixel blurriness on grid lines.
const MINOR_GRID_CM = 5;
const snapScale = (raw: number): number => Math.floor(raw * MINOR_GRID_CM) / MINOR_GRID_CM;

export const useMirrorScale = (widthCm: number, heightCm: number) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const availableWidth = containerSize.width - PADDING;
  const availableHeight = containerSize.height - PADDING;

  const rawScale = Math.min(availableWidth / widthCm, availableHeight / heightCm, MAX_SCALE);
  const scale = snapScale(rawScale);

  return {
    containerRef,
    scale,
    canvasWidth: widthCm * scale,
    canvasHeight: heightCm * scale,
  };
};
