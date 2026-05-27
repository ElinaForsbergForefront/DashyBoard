import { useEffect } from 'react';
import type { Location, NavigateFunction } from 'react-router-dom';
import type { MirrorDto } from '../api/types/mirror';

const EDIT_MODE_STORAGE_KEY = 'editMode';

interface UseMirrorSessionLifecycleOptions {
  location: Location;
  navigate: NavigateFunction;
  isEditMode: boolean;
  activeMirrorId: string | null;
  activeMirror: MirrorDto | null;
  setActiveMirrorId: (id: string | null) => void;
  hasDraftSession: boolean;
  hasUnsavedChanges: () => boolean;
  startEditSession: (mirror: MirrorDto) => void;
  resetEditorState: () => void;
  discardEditMode: () => void;
}

export function useMirrorSessionLifecycle({
  location,
  navigate,
  isEditMode,
  activeMirrorId,
  activeMirror,
  setActiveMirrorId,
  hasDraftSession,
  hasUnsavedChanges,
  startEditSession,
  resetEditorState,
  discardEditMode,
}: UseMirrorSessionLifecycleOptions) {
  useEffect(() => {
    const stateId = (location.state as { activeMirrorId?: string } | null)?.activeMirrorId;
    if (stateId) {
      setActiveMirrorId(stateId);
    }
  }, [location.state, setActiveMirrorId]);

  useEffect(() => {
    if (isEditMode && activeMirror && !hasDraftSession) {
      startEditSession(activeMirror);
    }
  }, [activeMirror, hasDraftSession, isEditMode, startEditSession]);

  useEffect(() => {
    const state = location.state as { activeMirrorId?: string; enterEditMode?: boolean } | null;

    if (isEditMode && !activeMirrorId && !state?.activeMirrorId && !state?.enterEditMode) {
      resetEditorState();
      discardEditMode();
    }
  }, [activeMirrorId, discardEditMode, isEditMode, location.state, resetEditorState]);

  useEffect(() => {
    const state = location.state as { enterEditMode?: boolean } | null;

    if (state?.enterEditMode && activeMirror && !isEditMode) {
      startEditSession(activeMirror);
      navigate('/', { replace: true, state: { activeMirrorId } });
    }
  }, [activeMirror, activeMirrorId, isEditMode, location.state, navigate, startEditSession]);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      window.localStorage.setItem(EDIT_MODE_STORAGE_KEY, 'false');

      if (!hasUnsavedChanges()) {
        return;
      }

      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, isEditMode]);
}
