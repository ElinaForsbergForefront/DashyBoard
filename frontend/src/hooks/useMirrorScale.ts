import { useEffect, useRef, useState } from 'react';

const MAX_SCALE = 10;
const PADDING = 32;

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
  const scale = Math.min(availableWidth / widthCm, availableHeight / heightCm, MAX_SCALE);

  return {
    containerRef,
    scale,
    canvasWidth: widthCm * scale,
    canvasHeight: heightCm * scale,
  };
};
