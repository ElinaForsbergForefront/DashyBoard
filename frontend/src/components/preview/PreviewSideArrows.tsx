import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  count: number;
  currentIndex: number;
  goPrev: () => void;
  goNext: () => void;
  hudBtn: string;
  ui: string;
}

export function PreviewSideArrows({ count, currentIndex, goPrev, goNext, hudBtn, ui }: Props) {
  if (count <= 1) return null;

  return (
    <>
      <button
        type="button"
        onClick={goPrev}
        disabled={currentIndex <= 0}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none ${ui} ${hudBtn}`}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={currentIndex >= count - 1}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer disabled:opacity-0 disabled:pointer-events-none ${ui} ${hudBtn}`}
      >
        <ChevronRight size={18} />
      </button>
    </>
  );
}
