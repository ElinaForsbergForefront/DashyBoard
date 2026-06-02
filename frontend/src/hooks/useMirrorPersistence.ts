import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useAddWidgetMutation,
  useMoveWidgetMutation,
  useRemoveWidgetMutation,
  useUpdateWidgetConfigMutation,
} from '../api/endpoints/mirror';
import { useMirrorAutosavePreference } from './useMirrorAutosavePreference';
import { buildMirrorWidgetMutationPlan } from '../utils/mirrorWidgetMutationPlan';
import type { MirrorDto } from '../api/types/mirror';

const AUTOSAVE_INTERVAL_MS = 15_000;
const AUTOSAVE_STATUS_RESET_MS = 2_000;

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'saved-manual' | 'error';

interface UseMirrorPersistenceOptions {
  isEditMode: boolean;
  activeMirrorId: string | null;
  activeMirror: MirrorDto | null;
  hasOpenWidgetEditor: boolean;
  snapshotRef: React.RefObject<MirrorDto | null>;
  localMirrorRef: React.RefObject<MirrorDto | null>;
  clearDraft: () => void;
  syncDraftFromMirror: (mirror: MirrorDto) => void;
  saveEditMode: () => void;
  refetchMirrors: () => Promise<unknown>;
}

export function useMirrorPersistence({
  isEditMode,
  activeMirrorId,
  activeMirror,
  hasOpenWidgetEditor,
  snapshotRef,
  localMirrorRef,
  clearDraft,
  syncDraftFromMirror,
  saveEditMode,
  refetchMirrors,
}: UseMirrorPersistenceOptions) {
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveInFlightRef = useRef(false);
  const pendingAutosaveSyncMirrorIdRef = useRef<string | null>(null);
  const autosaveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isAutosaveEnabled, toggleAutosave } = useMirrorAutosavePreference();

  const [addWidget] = useAddWidgetMutation();
  const [moveWidget] = useMoveWidgetMutation();
  const [removeWidget] = useRemoveWidgetMutation();
  const [updateWidgetConfig] = useUpdateWidgetConfigMutation();

  const clearAutosaveStatusTimer = useCallback(() => {
    if (autosaveStatusTimeoutRef.current) {
      clearTimeout(autosaveStatusTimeoutRef.current);
      autosaveStatusTimeoutRef.current = null;
    }
  }, []);

  const updateAutosaveStatus = useCallback(
    (nextStatus: AutosaveStatus) => {
      clearAutosaveStatusTimer();
      setAutosaveStatus(nextStatus);

      if (nextStatus === 'saved' || nextStatus === 'saved-manual') {
        setLastSavedAt(new Date());
        autosaveStatusTimeoutRef.current = setTimeout(() => {
          setAutosaveStatus('idle');
          autosaveStatusTimeoutRef.current = null;
        }, AUTOSAVE_STATUS_RESET_MS);
      } else if (nextStatus === 'error') {
        autosaveStatusTimeoutRef.current = setTimeout(() => {
          setAutosaveStatus('idle');
          autosaveStatusTimeoutRef.current = null;
        }, AUTOSAVE_STATUS_RESET_MS);
      }
    },
    [clearAutosaveStatusTimer],
  );

  const resetPersistenceState = useCallback(() => {
    clearAutosaveStatusTimer();
    updateAutosaveStatus('idle');
    pendingAutosaveSyncMirrorIdRef.current = null;
    saveInFlightRef.current = false;
  }, [clearAutosaveStatusTimer, updateAutosaveStatus]);

  const applyMutationPlanSequentially = useCallback(
    async (mirrorId: string, mutationPlan: ReturnType<typeof buildMirrorWidgetMutationPlan>) => {
      for (const widgetId of mutationPlan.removedWidgetIds) {
        await removeWidget({ mirrorId, widgetId }).unwrap();
      }

      for (const widget of mutationPlan.addedWidgets) {
        await addWidget({ mirrorId, body: widget }).unwrap();
      }

      for (const { widgetId, x, y } of mutationPlan.movedWidgets) {
        await moveWidget({ mirrorId, widgetId, body: { x, y } }).unwrap();
      }

      for (const { widgetId, config } of mutationPlan.updatedWidgetConfigs) {
        await updateWidgetConfig({ mirrorId, widgetId, body: { config } }).unwrap();
      }
    },
    [addWidget, moveWidget, removeWidget, updateWidgetConfig],
  );

  const flushMirrorChanges = useCallback(
    async ({
      exitEditMode,
      trigger,
      syncDraftWithServer = !exitEditMode,
    }: {
      exitEditMode: boolean;
      trigger: 'manual' | 'autosave';
      syncDraftWithServer?: boolean;
    }) => {
      if (saveInFlightRef.current || pendingAutosaveSyncMirrorIdRef.current) {
        return false;
      }

      const snapshot = snapshotRef.current;
      const draft = localMirrorRef.current;

      if (!snapshot || !draft) {
        if (exitEditMode) {
          saveEditMode();
          clearDraft();
        }

        return true;
      }

      const mutationPlan = buildMirrorWidgetMutationPlan(snapshot, draft);

      if (!mutationPlan.hasChanges) {
        if (exitEditMode) {
          saveEditMode();
          clearDraft();
        }

        return true;
      }

      saveInFlightRef.current = true;
      updateAutosaveStatus('saving');

      if (exitEditMode) {
        saveEditMode();
      }

      try {
        await applyMutationPlanSequentially(draft.id, mutationPlan);

        if (exitEditMode) {
          await refetchMirrors();
          clearDraft();
          resetPersistenceState();
          updateAutosaveStatus(trigger === 'manual' ? 'saved-manual' : 'saved');
          return true;
        }

        if (!syncDraftWithServer) {
          await refetchMirrors();
          clearDraft();
          resetPersistenceState();
          updateAutosaveStatus(trigger === 'manual' ? 'saved-manual' : 'saved');
          return true;
        }

        pendingAutosaveSyncMirrorIdRef.current = draft.id;
        await refetchMirrors();
        return true;
      } catch {
        saveInFlightRef.current = false;
        pendingAutosaveSyncMirrorIdRef.current = null;

        if (trigger === 'autosave') {
          updateAutosaveStatus('error');
        }

        return false;
      }
    },
    [
      applyMutationPlanSequentially,
      clearDraft,
      localMirrorRef,
      refetchMirrors,
      resetPersistenceState,
      saveEditMode,
      snapshotRef,
      updateAutosaveStatus,
    ],
  );

  useEffect(() => {
    return () => {
      clearAutosaveStatusTimer();
    };
  }, [clearAutosaveStatusTimer]);

  useEffect(() => {
    const pendingMirrorId = pendingAutosaveSyncMirrorIdRef.current;

    if (!pendingMirrorId || !activeMirror || activeMirror.id !== pendingMirrorId) {
      return;
    }

    syncDraftFromMirror(activeMirror);
    pendingAutosaveSyncMirrorIdRef.current = null;
    saveInFlightRef.current = false;
    updateAutosaveStatus('saved');
  }, [activeMirror, syncDraftFromMirror, updateAutosaveStatus]);

  useEffect(() => {
    if (!isEditMode || !activeMirrorId || !isAutosaveEnabled) {
      return;
    }

    const intervalId = setInterval(() => {
      const mutationPlan = buildMirrorWidgetMutationPlan(
        snapshotRef.current,
        localMirrorRef.current,
      );

      if (
        hasOpenWidgetEditor ||
        !mutationPlan.hasChanges ||
        saveInFlightRef.current ||
        pendingAutosaveSyncMirrorIdRef.current
      ) {
        return;
      }

      void flushMirrorChanges({ exitEditMode: false, trigger: 'autosave' });
    }, AUTOSAVE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    activeMirrorId,
    flushMirrorChanges,
    hasOpenWidgetEditor,
    isAutosaveEnabled,
    isEditMode,
    localMirrorRef,
    snapshotRef,
  ]);

  return {
    autosaveStatus,
    lastSavedAt,
    isAutosaveEnabled,
    isPersistenceBusy: saveInFlightRef.current || pendingAutosaveSyncMirrorIdRef.current !== null,
    resetPersistenceState,
    flushMirrorChanges,
    toggleAutosavePreference: toggleAutosave,
  };
}
