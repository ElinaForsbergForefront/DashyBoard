import { useEffect, useRef, useState } from 'react';
import type { MirrorDto } from '../../api/types/mirror';
import { useEditModeContext } from '../../context/EditModeContext';

const MAX_SCALE = 10;
const PADDING = 32;

interface MirrorCanvasProps {
  mirror: MirrorDto | null;
}

export const MirrorCanvas = ({ mirror }: MirrorCanvasProps) => {
  const { isEditMode } = useEditModeContext();
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

  if (!mirror) {
    return (
      <div ref={containerRef} className="flex-1 flex items-center justify-center">
        <p className="text-muted text-sm">Select a mirror to start editing</p>
      </div>
    );
  }

  const availableWidth = containerSize.width - PADDING;
  const availableHeight = containerSize.height - PADDING;

  const scale = Math.min(
    availableWidth / mirror.widthCm,
    availableHeight / mirror.heightCm,
    MAX_SCALE,
  );

  const canvasWidth = mirror.widthCm * scale;
  const canvasHeight = mirror.heightCm * scale;

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center gap-3 overflow-hidden p-8"
    >
      <div
        style={{ width: canvasWidth, height: canvasHeight }}
        className={`transition-all duration-300 rounded ${
          isEditMode
            ? 'ring-2 ring-primary outline-dashed outline-2 -outline-offset-2 outline-primary/30 bg-surface/50'
            : 'border border-border bg-surface/30'
        }`}
      />
      <p className="text-xs text-muted">
        {mirror.widthCm} × {mirror.heightCm} cm
        <span className="ml-2 opacity-50">(1cm = {scale.toFixed(1)}px)</span>
      </p>
    </div>
  );
};
