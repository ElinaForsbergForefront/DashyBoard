import { useEffect, useRef, useState } from 'react';

// Högsta tillåtna zoom-faktor så spegeln inte blir orimligt stor
const MAX_SCALE = 10;
const PADDING = 32;

// Räknar ut hur stor spegeln ska visas baserat på spegelns verkliga mått (i cm)
// och hur mycket utrymme som finns i containern
export const useMirrorScale = (widthCm: number, heightCm: number) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Håller koll på containerns nuvarande storlek i pixlar
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // ResizeObserver lyssnar på storleksförändringar och uppdaterar state
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const availableWidth = containerSize.width - PADDING;
  const availableHeight = containerSize.height - PADDING;

  // Välj den minsta skalan så spegeln alltid får plats, men aldrig överstiger MAX_SCALE
  const scale = Math.min(availableWidth / widthCm, availableHeight / heightCm, MAX_SCALE);

  return {
    containerRef,
    scale,
    canvasWidth: widthCm * scale,
    canvasHeight: heightCm * scale,
  };
};
