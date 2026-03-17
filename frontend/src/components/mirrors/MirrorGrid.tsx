const MINOR_GRID_CM = 5;
const MAJOR_GRID_CM = 10;

interface MirrorGridProps {
  widthPx: number;
  heightPx: number;
  scale: number;
  widthCm: number;
  heightCm: number;
}

export const MirrorGrid = ({ widthPx, heightPx, scale, widthCm, heightCm }: MirrorGridProps) => {
  const lines = [];

  for (let cm = MINOR_GRID_CM; cm < widthCm; cm += MINOR_GRID_CM) {
    const x = cm * scale;
    const isMajor = cm % MAJOR_GRID_CM === 0;
    lines.push(
      <line
        key={`v-${cm}`}
        x1={x}
        y1={0}
        x2={x}
        y2={heightPx}
        stroke="currentColor"
        strokeWidth={isMajor ? 0.6 : 0.3}
        strokeOpacity={isMajor ? 0.25 : 0.1}
      />,
    );
  }

  for (let cm = MINOR_GRID_CM; cm < heightCm; cm += MINOR_GRID_CM) {
    const y = cm * scale;
    const isMajor = cm % MAJOR_GRID_CM === 0;
    lines.push(
      <line
        key={`h-${cm}`}
        x1={0}
        y1={y}
        x2={widthPx}
        y2={y}
        stroke="currentColor"
        strokeWidth={isMajor ? 0.6 : 0.3}
        strokeOpacity={isMajor ? 0.25 : 0.1}
      />,
    );
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full text-foreground pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {lines}
    </svg>
  );
};
