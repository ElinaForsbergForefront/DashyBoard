import { useCallback, useMemo, useState } from 'react';
import type { MirrorDto } from '../api/types/mirror';

interface UseMirrorSwitchGuardOptions {
  activeMirrorId: string | null;
  mirrors: MirrorDto[];
  isEditMode: boolean;
  hasUnsavedChanges: () => boolean;
  isBusy: boolean;
  setActiveMirrorId: (id: string | null) => void;
  startEditSession: (mirror: MirrorDto) => void;
  resetEditorState: () => void;
  saveBeforeSwitch: () => Promise<boolean>;
}

export function useMirrorSwitchGuard({
  activeMirrorId,
  mirrors,
  isEditMode,
  hasUnsavedChanges,
  isBusy,
  setActiveMirrorId,
  startEditSession,
  resetEditorState,
  saveBeforeSwitch,
}: UseMirrorSwitchGuardOptions) {
  const [pendingMirrorSwitchId, setPendingMirrorSwitchId] = useState<string | null>(null);
  const [isResolvingMirrorSwitch, setIsResolvingMirrorSwitch] = useState(false);

  const pendingMirrorSwitch = useMemo(
    () => mirrors.find((mirror) => mirror.id === pendingMirrorSwitchId) ?? null,
    [mirrors, pendingMirrorSwitchId],
  );

  const completeMirrorSwitch = useCallback(
    (nextMirror: MirrorDto) => {
      resetEditorState();
      setPendingMirrorSwitchId(null);
      setActiveMirrorId(nextMirror.id);
      startEditSession(nextMirror);
    },
    [resetEditorState, setActiveMirrorId, startEditSession],
  );

  const handleSelectMirror = useCallback(
    async (id: string) => {
      if (id === activeMirrorId) {
        return;
      }

      const nextMirror = mirrors.find((mirror) => mirror.id === id) ?? null;

      if (!nextMirror) {
        setActiveMirrorId(id);
        return;
      }

      if (!isEditMode) {
        setActiveMirrorId(id);
        return;
      }

      if (isBusy) {
        return;
      }

      if (hasUnsavedChanges()) {
        setPendingMirrorSwitchId(id);
        return;
      }

      completeMirrorSwitch(nextMirror);
    },
    [
      activeMirrorId,
      completeMirrorSwitch,
      hasUnsavedChanges,
      isBusy,
      isEditMode,
      mirrors,
      setActiveMirrorId,
    ],
  );

  const handleClosePendingMirrorSwitch = useCallback(() => {
    if (isResolvingMirrorSwitch) {
      return;
    }

    setPendingMirrorSwitchId(null);
  }, [isResolvingMirrorSwitch]);

  const handleDiscardAndSwitch = useCallback(() => {
    if (!pendingMirrorSwitch || isResolvingMirrorSwitch) {
      return;
    }

    completeMirrorSwitch(pendingMirrorSwitch);
  }, [completeMirrorSwitch, isResolvingMirrorSwitch, pendingMirrorSwitch]);

  const handleSaveAndSwitch = useCallback(async () => {
    if (!pendingMirrorSwitch || isResolvingMirrorSwitch) {
      return;
    }

    setIsResolvingMirrorSwitch(true);

    try {
      const didSave = await saveBeforeSwitch();

      if (!didSave) {
        return;
      }

      completeMirrorSwitch(pendingMirrorSwitch);
    } finally {
      setIsResolvingMirrorSwitch(false);
    }
  }, [completeMirrorSwitch, isResolvingMirrorSwitch, pendingMirrorSwitch, saveBeforeSwitch]);

  return {
    pendingMirrorSwitch,
    isResolvingMirrorSwitch,
    handleSelectMirror,
    handleClosePendingMirrorSwitch,
    handleDiscardAndSwitch,
    handleSaveAndSwitch,
  };
}
