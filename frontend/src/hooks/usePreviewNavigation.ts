import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MirrorDto } from '../api/types/mirror';

export function usePreviewNavigation(mirrorId: string | undefined, mirrors: MirrorDto[]) {
  const navigate = useNavigate();

  const currentIndex = mirrors.findIndex((m) => m.id === mirrorId);

  const goTo = (id: string) => navigate(`/preview/${id}`);
  const goPrev = () => currentIndex > 0 && goTo(mirrors[currentIndex - 1].id);
  const goNext = () => currentIndex < mirrors.length - 1 && goTo(mirrors[currentIndex + 1].id);

  // No deps array intentional — keeps goPrev/goNext always fresh
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return { currentIndex, goTo, goPrev, goNext };
}
