import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetMyMirrorsQuery } from '../api/endpoints/mirror';
import { useGetCurrentUserQuery } from '../api/endpoints/user';
import type { MirrorDto } from '../api/types/mirror';
import { useActiveMirror } from '../context/ActiveMirrorContext';
import { useEditModeContext } from '../context/EditModeContext';
import { useMirrorDraft } from './useMirrorDraft';
import { useMirrorPersistence } from './useMirrorPersistence';
import { useMirrorSessionLifecycle } from './useMirrorSessionLifecycle';
import { useMirrorSwitchGuard } from './useMirrorSwitchGuard';

export function useMirrorEditor() {
  const { isEditMode, enterEditMode, saveEditMode, discardEditMode } = useEditModeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeMirrorId, setActiveMirrorId } = useActiveMirror();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMirror, setEditingMirror] = useState<MirrorDto | null>(null);
  const [deletingMirror, setDeletingMirror] = useState<MirrorDto | null>(null);
  const { data: mirrors = [], refetch: refetchMirrors } = useGetMyMirrorsQuery();
  const { data: currentUser } = useGetCurrentUserQuery();

  const activeMirror = mirrors.find((mirror) => mirror.id === activeMirrorId) ?? null;
  const mirrorLimit = currentUser?.isPremium ? 10 : 3;
  const canAddMirror = mirrors.length < mirrorLimit;

  const {
    displayedMirror,
    snapshotRef,
    localMirrorRef,
    hasOpenWidgetEditor,
    hasDraftSession,
    initializeDraft,
    syncDraftFromMirror,
    clearDraft,
    hasUnsavedChanges,
    handleAddWidget,
    handleRemoveWidget,
    handleMoveWidget,
    handleUpdateWidgetConfig,
    handleWidgetEditorStateChange,
  } = useMirrorDraft(activeMirror);

  const {
    autosaveStatus,
    isAutosaveEnabled,
    isPersistenceBusy,
    resetPersistenceState,
    flushMirrorChanges,
    toggleAutosavePreference,
  } = useMirrorPersistence({
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
  });

  const resetEditorState = useCallback(() => {
    resetPersistenceState();
    clearDraft();
  }, [clearDraft, resetPersistenceState]);

  const startEditSession = useCallback(
    (mirror: MirrorDto) => {
      resetPersistenceState();
      initializeDraft(mirror);
      enterEditMode();
    },
    [enterEditMode, initializeDraft, resetPersistenceState],
  );

  useMirrorSessionLifecycle({
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
  });

  const {
    pendingMirrorSwitch,
    isResolvingMirrorSwitch,
    handleSelectMirror,
    handleClosePendingMirrorSwitch,
    handleDiscardAndSwitch,
    handleSaveAndSwitch,
  } = useMirrorSwitchGuard({
    activeMirrorId,
    mirrors,
    isEditMode,
    hasUnsavedChanges,
    isBusy: isPersistenceBusy,
    setActiveMirrorId,
    startEditSession,
    resetEditorState,
    saveBeforeSwitch: () =>
      flushMirrorChanges({
        exitEditMode: false,
        trigger: 'manual',
        syncDraftWithServer: false,
      }),
  });

  const handleEnterEditMode = useCallback(() => {
    if (!activeMirror) {
      return;
    }

    startEditSession(activeMirror);
  }, [activeMirror, startEditSession]);

  const handleSave = useCallback(async () => {
    await flushMirrorChanges({ exitEditMode: true, trigger: 'manual' });
  }, [flushMirrorChanges]);

  const handleDiscard = useCallback(() => {
    resetEditorState();
    discardEditMode();
  }, [discardEditMode, resetEditorState]);

  const handleToggleAutosave = useCallback(() => {
    resetPersistenceState();
    toggleAutosavePreference();
  }, [resetPersistenceState, toggleAutosavePreference]);

  const handleDeleted = useCallback(() => {
    if (deletingMirror?.id === activeMirrorId) {
      setActiveMirrorId(null);
    }

    setDeletingMirror(null);
  }, [activeMirrorId, deletingMirror?.id, setActiveMirrorId]);

  return {
    isEditMode,
    activeMirrorId,
    activeMirror,
    displayedMirror,
    showCreateModal,
    editingMirror,
    deletingMirror,
    pendingMirrorSwitch,
    isResolvingMirrorSwitch,
    canAddMirror,
    isAutosaveEnabled,
    autosaveStatus,
    openCreateModal: () => setShowCreateModal(true),
    closeCreateModal: () => setShowCreateModal(false),
    openEditMirrorModal: setEditingMirror,
    openDeleteMirrorModal: setDeletingMirror,
    closeEditMirrorModal: () => setEditingMirror(null),
    closeDeleteMirrorModal: () => setDeletingMirror(null),
    handleDeleted,
    handleSelectMirror,
    handleClosePendingMirrorSwitch,
    handleDiscardAndSwitch,
    handleSaveAndSwitch,
    handleEnterEditMode,
    handleSave,
    handleDiscard,
    handleToggleAutosave,
    handleAddWidget,
    handleRemoveWidget,
    handleMoveWidget,
    handleUpdateWidgetConfig,
    handleWidgetEditorStateChange,
    previewMirror: activeMirrorId ? () => navigate(`/preview/${activeMirrorId}`) : undefined,
    canAddWidget: Boolean(activeMirrorId),
  };
}
